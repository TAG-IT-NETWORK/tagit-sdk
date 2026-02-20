/** A2A Protocol types — Google Agent-to-Agent JSON-RPC 2.0 */

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

export interface AgentCapabilities {
  streaming: boolean;
  pushNotifications: boolean;
  stateTransitionHistory: boolean;
}

export interface AgentCardSkill {
  id: string;
  name: string;
  description: string;
  tags: string[];
  inputSchema: Record<string, unknown>;
}

export interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

export interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: JsonRpcError;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

export type TaskStatus =
  | "submitted"
  | "working"
  | "input-required"
  | "completed"
  | "canceled"
  | "failed";

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

export interface SendTaskParams {
  skill: string;
  input: Record<string, unknown>;
}

export interface GetTaskParams {
  id: string;
}

export interface CancelTaskParams {
  id: string;
}

export interface A2AClientConfig {
  baseUrl: string;
  authToken?: string;
  timeout?: number;
  maxRetries?: number;
  fetch?: typeof globalThis.fetch;
}

export interface SSEEvent {
  event: string;
  data: unknown;
}
