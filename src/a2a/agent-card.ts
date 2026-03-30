import type { AgentCard, A2AClientConfig } from "./types.js";
import { agentCardSchema } from "./schemas.js";
import { A2AConnectionError, A2ATimeoutError } from "./errors.js";

const AGENT_CARD_PATH = "/.well-known/agent.json";
const DEFAULT_TIMEOUT = 30_000;

/**
 * Fetch and validate an A2A agent card from `<baseUrl>/.well-known/agent.json`.
 *
 * @param baseUrl - The agent server's base URL (trailing slashes are stripped).
 * @param config - Optional auth token, timeout, and injectable fetch function.
 * @returns A validated {@link AgentCard}.
 * @throws {A2AConnectionError} When the HTTP request fails or returns a non-OK status.
 * @throws {A2ATimeoutError} When the request exceeds the configured timeout.
 *
 * @example
 * ```ts
 * import { fetchAgentCard } from "@tagit/sdk/a2a";
 *
 * const card = await fetchAgentCard("https://agent.example.com");
 * console.log(card.name, card.skills);
 * ```
 */
export async function fetchAgentCard(
  baseUrl: string,
  config?: Pick<A2AClientConfig, "authToken" | "timeout" | "fetch">,
): Promise<AgentCard> {
  const fetchFn = config?.fetch ?? globalThis.fetch;
  const timeout = config?.timeout ?? DEFAULT_TIMEOUT;

  const url = baseUrl.replace(/\/+$/, "") + AGENT_CARD_PATH;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (config?.authToken) {
      headers["Authorization"] = `Bearer ${config.authToken}`;
    }

    const response = await fetchFn(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new A2AConnectionError(url);
    }

    const body: unknown = await response.json();
    return agentCardSchema.parse(body);
  } catch (error) {
    if (error instanceof A2AConnectionError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new A2ATimeoutError(url, timeout);
    }
    throw new A2AConnectionError(url, { cause: error });
  } finally {
    clearTimeout(timer);
  }
}
