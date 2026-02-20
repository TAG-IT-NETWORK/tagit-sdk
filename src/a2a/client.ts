import type {
  A2AClientConfig,
  A2ATask,
  AgentCard,
  JsonRpcRequest,
  SendTaskParams,
  GetTaskParams,
  CancelTaskParams,
  SSEEvent,
} from "./types.js";
import { a2aTaskSchema, jsonRpcResponseSchema } from "./schemas.js";
import { fetchAgentCard } from "./agent-card.js";
import { parseSSEStream } from "./sse.js";
import {
  A2AConnectionError,
  A2AProtocolError,
  A2ATimeoutError,
} from "./errors.js";

const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 3;
const BASE_DELAY_MS = 1_000;

export class A2AClient {
  private readonly _baseUrl: string;
  private readonly _authToken: string | undefined;
  private readonly _timeout: number;
  private readonly _maxRetries: number;
  private readonly _fetch: typeof globalThis.fetch;
  private _cachedCard: AgentCard | null = null;
  private _requestId = 0;

  constructor(config: A2AClientConfig) {
    this._baseUrl = config.baseUrl.replace(/\/+$/, "");
    this._authToken = config.authToken;
    this._timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this._maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    this._fetch = config.fetch ?? globalThis.fetch;
  }

  get agentCard(): AgentCard | null {
    return this._cachedCard;
  }

  async connect(opts?: { force?: boolean }): Promise<AgentCard> {
    if (this._cachedCard && !opts?.force) {
      return this._cachedCard;
    }

    this._cachedCard = await fetchAgentCard(this._baseUrl, {
      authToken: this._authToken,
      timeout: this._timeout,
      fetch: this._fetch,
    });

    return this._cachedCard;
  }

  async sendTask(params: SendTaskParams): Promise<A2ATask> {
    const response = await this._rpc("message/send", {
      skill: params.skill,
      input: params.input,
    });
    return a2aTaskSchema.parse(response);
  }

  async getTask(params: GetTaskParams): Promise<A2ATask> {
    const response = await this._rpc("tasks/get", { id: params.id });
    return a2aTaskSchema.parse(response);
  }

  async cancelTask(params: CancelTaskParams): Promise<A2ATask> {
    const response = await this._rpc("tasks/cancel", { id: params.id });
    return a2aTaskSchema.parse(response);
  }

  async *subscribe(
    params: SendTaskParams,
  ): AsyncGenerator<SSEEvent, A2ATask | undefined, undefined> {
    const request = this._buildRequest("message/send", {
      skill: params.skill,
      input: params.input,
    });

    const response = await this._fetchWithRetry(
      this._baseUrl,
      {
        method: "POST",
        headers: {
          ...this._headers(),
          Accept: "text/event-stream",
        },
        body: JSON.stringify(request),
      },
    );

    const contentType = response.headers.get("Content-Type") ?? "";

    // Graceful fallback: server returned JSON instead of SSE
    if (contentType.includes("application/json")) {
      const json: unknown = await response.json();
      const rpc = jsonRpcResponseSchema.parse(json);
      if (rpc.error) {
        throw new A2AProtocolError(rpc.error.code, rpc.error.message, rpc.error.data);
      }
      return a2aTaskSchema.parse(rpc.result);
    }

    // SSE stream
    if (!response.body) {
      throw new A2AConnectionError(this._baseUrl);
    }

    let lastTask: A2ATask | undefined;
    for await (const event of parseSSEStream(response.body)) {
      yield event;
      if (event.event === "result" || event.event === "error") {
        try {
          lastTask = a2aTaskSchema.parse(event.data);
        } catch {
          // non-task event data, skip
        }
      }
    }

    return lastTask;
  }

  private async _rpc(method: string, params: Record<string, unknown>): Promise<unknown> {
    const request = this._buildRequest(method, params);

    const response = await this._fetchWithRetry(this._baseUrl, {
      method: "POST",
      headers: this._headers(),
      body: JSON.stringify(request),
    });

    const json: unknown = await response.json();
    const rpc = jsonRpcResponseSchema.parse(json);

    if (rpc.error) {
      throw new A2AProtocolError(rpc.error.code, rpc.error.message, rpc.error.data);
    }

    return rpc.result;
  }

  private _buildRequest(method: string, params: Record<string, unknown>): JsonRpcRequest {
    return {
      jsonrpc: "2.0",
      id: ++this._requestId,
      method,
      params,
    };
  }

  private _headers(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this._authToken) {
      headers["Authorization"] = `Bearer ${this._authToken}`;
    }
    return headers;
  }

  private async _fetchWithRetry(url: string, init: RequestInit): Promise<Response> {
    let lastError: unknown;

    for (let attempt = 0; attempt <= this._maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this._timeout);

      try {
        const response = await this._fetch(url, {
          ...init,
          signal: controller.signal,
        });

        if (!response.ok) {
          // Try to parse as JSON-RPC error — don't retry HTTP errors
          const contentType = response.headers.get("Content-Type") ?? "";
          if (contentType.includes("application/json")) {
            const json: unknown = await response.json();
            const rpc = jsonRpcResponseSchema.safeParse(json);
            if (rpc.success && rpc.data.error) {
              throw new A2AProtocolError(
                rpc.data.error.code,
                rpc.data.error.message,
                rpc.data.error.data,
              );
            }
          }
          throw new A2AConnectionError(url);
        }

        return response;
      } catch (error) {
        clearTimeout(timer);

        // Don't retry protocol errors
        if (error instanceof A2AProtocolError) throw error;

        if (error instanceof Error && error.name === "AbortError") {
          lastError = new A2ATimeoutError(url, this._timeout);
        } else {
          lastError = error instanceof A2AConnectionError
            ? error
            : new A2AConnectionError(url, { cause: error });
        }

        // Only retry network/timeout errors
        if (attempt < this._maxRetries) {
          await this._delay(attempt);
        }
      } finally {
        clearTimeout(timer);
      }
    }

    throw lastError;
  }

  private _delay(attempt: number): Promise<void> {
    const jitter = Math.random() * 0.3 + 0.85; // 0.85–1.15
    const ms = BASE_DELAY_MS * Math.pow(2, attempt) * jitter;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
