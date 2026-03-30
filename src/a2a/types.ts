/** A2A Protocol types -- Google Agent-to-Agent JSON-RPC 2.0 */

/**
 * Remote agent's self-description, served at `/.well-known/agent.json`.
 */
export interface AgentCard {
  name: string;
  description: string;
  url: string;
  version: string;
  capabilities: AgentCapabilities;
  skills: AgentCardSkill[];
  defaultInputModes: string[];
  defaultOutputModes: string[];
}

/** Capabilities advertised by the remote agent. */
export interface AgentCapabilities {
  streaming: boolean;
  pushNotifications: boolean;
  stateTransitionHistory: boolean;
}

/** A skill exposed by the remote agent. */
export interface AgentCardSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  inputSchema: Record<string, unknown>;
}

/** JSON-RPC 2.0 request envelope. */
export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

/** JSON-RPC 2.0 response envelope. */
export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: JsonRpcError;
}

/** JSON-RPC 2.0 error object. */
export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

/** Possible lifecycle statuses of an A2A task. */
export type TaskStatus =
  | "submitted"
  | "working"
  | "input-required"
  | "completed"
  | "canceled"
  | "failed";

/** A task managed by the remote A2A agent. */
export interface A2ATask {
  id: string;
  status: TaskStatus;
  skill: string;
  input: Record<string, unknown>;
  output?: unknown;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

/** Standard JSON-RPC error codes */
export const RPC_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  TASK_NOT_FOUND: -32001,
  SKILL_NOT_FOUND: -32002,
} as const;

/** Parameters for the `sendTask` / `subscribe` methods. */
export interface SendTaskParams {
  skill: string;
  input: Record<string, unknown>;
}

/** Parameters for the `getTask` method. */
export interface GetTaskParams {
  id: string;
}

/** Parameters for the `cancelTask` method. */
export interface CancelTaskParams {
  id: string;
}

/** Configuration for {@link A2AClient}. */
export interface A2AClientConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
  maxRetries?: number;
  fetch?: typeof globalThis.fetch;
}

/** A single parsed Server-Sent Event from an A2A streaming response. */
export interface SSEEvent {
  event: string;
  data: unknown;
}
