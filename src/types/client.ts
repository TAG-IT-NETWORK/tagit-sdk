import type { Address, Chain, PublicClient, WalletClient } from "viem";

/**
 * Configuration for {@link createAgentClient}.
 *
 * All fields are optional. When omitted, the client defaults to OP Sepolia
 * with the chain's default public RPC and read-only mode.
 */
export interface AgentClientConfig {
  /** Target chain definition (defaults to OP Sepolia). */
  chain?: Chain;
  /** Custom RPC URL (overrides the chain's default). */
  rpcUrl?: string;
  /** Private key for creating a wallet client (hex-encoded with `0x` prefix). */
  privateKey?: `0x${string}`;
  /** Pre-built viem public client (overrides chain/rpcUrl). */
  publicClient?: PublicClient;
  /** Pre-built viem wallet client (overrides privateKey). */
  walletClient?: WalletClient;
}

/** Read-only methods for the TAGITAgentIdentity contract. */
export interface IdentityReadMethods {
  getAgent(agentId: bigint): Promise<{
    registrant: Address;
    wallet: Address;
    registeredAt: bigint;
    active: boolean;
  }>;
  getAgentStatus(agentId: bigint): Promise<number>;
  getAgentByWallet(wallet: Address): Promise<bigint>;
  getAgentsByRegistrant(registrant: Address): Promise<readonly bigint[]>;
  getMetadata(agentId: bigint, key: string): Promise<string>;
  isActiveAgent(agentId: bigint): Promise<boolean>;
  totalAgents(): Promise<bigint>;
  registrationFee(): Promise<bigint>;
  tokenURI(agentId: bigint): Promise<string>;
}

/** Write methods for the TAGITAgentIdentity contract (require wallet). */
export interface IdentityWriteMethods {
  register(wallet: Address, uri: string, value?: bigint): Promise<`0x${string}`>;
  setAgentURI(agentId: bigint, uri: string): Promise<`0x${string}`>;
  setMetadata(agentId: bigint, key: string, value: string): Promise<`0x${string}`>;
  suspendAgent(agentId: bigint): Promise<`0x${string}`>;
  reactivateAgent(agentId: bigint): Promise<`0x${string}`>;
  decommissionAgent(agentId: bigint): Promise<`0x${string}`>;
}

/** Read-only methods for the TAGITAgentReputation contract. */
export interface ReputationReadMethods {
  getSummary(agentId: bigint): Promise<{
    totalFeedback: bigint;
    activeFeedback: bigint;
    averageRating: bigint;
    weightedScore: bigint;
    lastFeedbackAt: bigint;
  }>;
  getFeedback(feedbackId: bigint): Promise<{
    reviewer: Address;
    agentId: bigint;
    rating: number;
    comment: string;
    response: string;
    timestamp: bigint;
    revoked: boolean;
  }>;
  readAllFeedback(agentId: bigint): Promise<
    readonly {
      reviewer: Address;
      agentId: bigint;
      rating: number;
      comment: string;
      response: string;
      timestamp: bigint;
      revoked: boolean;
    }[]
  >;
  getAgentFeedbackIds(agentId: bigint): Promise<readonly bigint[]>;
  getReviewerFeedback(reviewer: Address, agentId: bigint): Promise<bigint>;
}

/** Write methods for the TAGITAgentReputation contract (require wallet). */
export interface ReputationWriteMethods {
  giveFeedback(agentId: bigint, rating: number, comment: string): Promise<`0x${string}`>;
  revokeFeedback(feedbackId: bigint): Promise<`0x${string}`>;
  appendResponse(feedbackId: bigint, responseText: string): Promise<`0x${string}`>;
}

/** Read-only methods for the TAGITAgentValidation contract. */
export interface ValidationReadMethods {
  getRequest(requestId: bigint): Promise<{
    agentId: bigint;
    requester: Address;
    quorum: number;
    responseCount: number;
    createdAt: bigint;
    status: number;
    isDefense: boolean;
  }>;
  getSummary(agentId: bigint): Promise<{
    totalRequests: bigint;
    passedCount: bigint;
    failedCount: bigint;
    latestScore: bigint;
    lastValidatedAt: bigint;
    isValidated: boolean;
  }>;
  getValidationStatus(agentId: bigint): Promise<{
    isValidated: boolean;
    latestScore: bigint;
    lastValidatedAt: bigint;
  }>;
  getResponses(requestId: bigint): Promise<
    readonly {
      validator: Address;
      score: number;
      justification: string;
      timestamp: bigint;
    }[]
  >;
  getAgentRequests(agentId: bigint): Promise<readonly bigint[]>;
  getValidatorStats(validator: Address): Promise<{
    totalResponses: bigint;
    accurateResponses: bigint;
    lastResponseAt: bigint;
  }>;
  hasValidatorResponded(requestId: bigint, validator: Address): Promise<boolean>;
}

/** Write methods for the TAGITAgentValidation contract (require wallet). */
export interface ValidationWriteMethods {
  validationRequest(agentId: bigint, isDefense: boolean): Promise<`0x${string}`>;
  validationResponse(requestId: bigint, score: number, justification: string): Promise<`0x${string}`>;
}

/** Read-only methods for the ReputationStaking (credibility bond) contract. */
export interface StakingReadMethods {
  getAgentStake(agentId: bigint): Promise<bigint>;
  getMinBond(): Promise<bigint>;
  hasMinBond(agentId: bigint): Promise<boolean>;
  getStaker(agentId: bigint): Promise<Address>;
}

/** Write methods for the ReputationStaking contract (require wallet). */
export interface StakingWriteMethods {
  stake(agentId: bigint, amount: bigint): Promise<`0x${string}`>;
  unstake(agentId: bigint): Promise<`0x${string}`>;
}

/** Real-time event watcher methods for identity, reputation, validation, and staking contracts. */
export interface EventMethods {
  watchAgentRegistered(
    onLogs: (logs: readonly { agentId: bigint; registrant: Address; wallet: Address; uri: string }[]) => void,
  ): () => void;
  watchAgentStatusChanged(
    onLogs: (logs: readonly { agentId: bigint; oldStatus: number; newStatus: number }[]) => void,
  ): () => void;
  watchFeedbackGiven(
    onLogs: (logs: readonly { feedbackId: bigint; agentId: bigint; reviewer: Address; rating: number }[]) => void,
  ): () => void;
  watchFeedbackRevoked(
    onLogs: (logs: readonly { feedbackId: bigint; agentId: bigint }[]) => void,
  ): () => void;
  watchValidationRequested(
    onLogs: (
      logs: readonly { requestId: bigint; agentId: bigint; requester: Address; isDefense: boolean }[],
    ) => void,
  ): () => void;
  watchValidationFinalized(
    onLogs: (logs: readonly { requestId: bigint; agentId: bigint; passed: boolean; finalScore: bigint }[]) => void,
  ): () => void;
  watchStakeDeposited(
    onLogs: (logs: readonly { agentId: bigint; staker: Address; amount: bigint }[]) => void,
  ): () => void;
  watchStakeWithdrawn(
    onLogs: (logs: readonly { agentId: bigint; staker: Address; amount: bigint }[]) => void,
  ): () => void;
  watchStakeSlashed(
    onLogs: (logs: readonly { agentId: bigint; amount: bigint; slashedBy: Address }[]) => void,
  ): () => void;
}

/**
 * The main SDK client returned by {@link createAgentClient}.
 *
 * Bundles identity, reputation, and validation contract access with event watchers.
 * Write methods are `Partial` -- they exist only when a wallet client is configured.
 */
export interface TagitAgentClient {
  identity: IdentityReadMethods & Partial<IdentityWriteMethods>;
  reputation: ReputationReadMethods & Partial<ReputationWriteMethods>;
  validation: ValidationReadMethods & Partial<ValidationWriteMethods>;
  staking: StakingReadMethods & Partial<StakingWriteMethods>;
  events: EventMethods;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}
