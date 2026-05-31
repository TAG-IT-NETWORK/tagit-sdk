// A2A Client
export { A2AClient } from "./client.js";
export { A2AClientPool } from "./pool.js";
export { fetchAgentCard } from "./agent-card.js";
export { parseSSEStream } from "./sse.js";

// Errors
export {
  A2AError,
  A2ATimeoutError,
  A2AConnectionError,
  A2AProtocolError,
} from "./errors.js";

// Schemas
export {
  agentCardSchema,
  a2aTaskSchema,
  jsonRpcResponseSchema,
} from "./schemas.js";

// Types
export type {
  AgentCard,
  AgentCapabilities,
  AgentCardSkill,
  A2ATask,
  TaskStatus,
  A2AClientConfig,
  SendTaskParams,
  GetTaskParams,
  CancelTaskParams,
  SSEEvent,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcError,
} from "./types.js";

export { RPC_ERRORS } from "./types.js";
