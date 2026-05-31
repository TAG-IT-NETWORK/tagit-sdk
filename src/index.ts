// Client factory — main entry point
export { createAgentClient } from "./client/index.js";

// Types
export {
  AgentStatus,
  RequestStatus,
  type Agent,
  type Feedback,
  type ReputationSummary,
  type ValidationRequest,
  type ValidatorResponse,
  type ValidationSummary,
  type ValidationStatus,
  type ValidatorStats,
  type AgentClientConfig,
  type TagitAgentClient,
  type WTagReadMethods,
  type WTagWriteMethods,
  type WTagEvents,
  type VoucherData,
  type VoucherReadMethods,
  type VoucherWriteMethods,
  type VoucherEvents,
  type AgentInfo,
  type AgentReadMethods,
  type AgentWriteMethods,
  AssetState,
  type AssetData,
  type ResolveApprovalStatus,
  type TagitCoreReadMethods,
  type TagitCoreWriteMethods,
} from "./types/index.js";

// Contract clients
export {
  createWTagReader,
  createWTagWriter,
  createVoucherReader,
  createVoucherWriter,
  createAgentReader,
  createAgentWriter,
  createTagitCoreReader,
  createTagitCoreWriter,
} from "./contracts/index.js";

// ABIs
export {
  agentIdentityAbi,
  agentReputationAbi,
  agentValidationAbi,
  wtagAbi,
  voucherAbi,
  tagitCoreAbi,
} from "./abi/index.js";

// Addresses & chains
export { getAddresses, type ContractAddresses } from "./addresses/index.js";
export { opSepolia } from "./chains/index.js";

// Errors
export { SdkError, ContractError, ValidationError } from "./errors/index.js";

// Validation schemas
export {
  addressSchema,
  agentIdSchema,
  ratingSchema,
  scoreSchema,
  uriSchema,
  commentSchema,
  justificationSchema,
  feedbackIdSchema,
  requestIdSchema,
} from "./utils/index.js";

// Bridge client
export { createBridgeClient, type BridgeClientConfig, type TagitBridgeClient } from "./bridge/index.js";

// A2A client
export {
  A2AClient,
  A2AClientPool,
  fetchAgentCard,
  parseSSEStream,
  A2AError,
  A2ATimeoutError,
  A2AConnectionError,
  A2AProtocolError,
  RPC_ERRORS,
  type AgentCard,
  type A2ATask,
  type A2AClientConfig,
  type SendTaskParams,
  type SSEEvent,
} from "./a2a/index.js";
