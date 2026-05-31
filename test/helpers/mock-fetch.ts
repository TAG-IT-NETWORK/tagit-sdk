import { vi } from "vitest";
import type { AgentCard, A2ATask, JsonRpcResponse } from "../../src/a2a/types.js";

export function createMockFetch() {
  return vi.fn<(input: string | URL | Request, init?: RequestInit) => Promise<Response>>();
}

export function jsonResponse(body: unknown, status = 200, headers?: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

export function sseResponse(events: Array<{ event: string; data: unknown }>): Response {
  const text = events
    .map((e) => `event: ${e.event}\ndata: ${JSON.stringify(e.data)}\n\n`)
    .join("");
  return new Response(text, {
    status: 200,
    headers: { "Content-Type": "text/event-stream" },
  });
}

export function makeAgentCard(overrides: Partial<AgentCard> = {}): AgentCard {
  return {
    name: "Test Agent",
    description: "A test agent",
    url: "http://localhost:3000",
    version: "1.0.0",
    capabilities: {
      streaming: true,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    skills: [
      {
        id: "echo",
        name: "Echo",
        description: "Echoes input",
        tags: ["test"],
        inputSchema: { type: "object", properties: { message: { type: "string" } } },
      },
    ],
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    ...overrides,
  };
}

export function makeTask(overrides: Partial<A2ATask> = {}): A2ATask {
  return {
    id: "task-1",
    status: "completed",
    skill: "echo",
    input: { message: "hello" },
    output: { message: "hello" },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:01.000Z",
    ...overrides,
  };
}

export function rpcSuccess(id: string | number, result: unknown): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

export function rpcError(
  id: string | number | null,
  code: number,
  message: string,
): JsonRpcResponse {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
