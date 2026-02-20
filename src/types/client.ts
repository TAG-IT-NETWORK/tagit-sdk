import type { Address, Chain, PublicClient, WalletClient } from "viem";

export interface AgentClientConfig {
  chain?: Chain;
  rpcUrl?: string;
  privateKey?: `0x${string}`;
  publicClient?: PublicClient;
  walletClient?: WalletClient;
}

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

export interface IdentityWriteMethods {
  register(wallet: Address, uri: string, value?: bigint): Promise<`0x${string}`>;
  setAgentURI(agentId: bigint, uri: string): Promise<`0x${string}`>;
  setMetadata(agentId: bigint, key: string, value: string): Promise<`0x${string}`>;
  suspendAgent(agentId: bigint): Promise<`0x${string}`>;
  reactivateAgent(agentId: bigint): Promise<`0x${string}`>;
  decommissionAgent(agentId: bigint): Promise<`0x${string}`>;
}

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

export interface ReputationWriteMethods {
  giveFeedback(agentId: bigint, rating: number, comment: string): Promise<`0x${string}`>;
  revokeFeedback(feedbackId: bigint): Promise<`0x${string}`>;
  appendResponse(feedbackId: bigint, responseText: string): Promise<`0x${string}`>;
}

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

export interface ValidationWriteMethods {
  validationRequest(agentId: bigint, isDefense: boolean): Promise<`0x${string}`>;
  validationResponse(requestId: bigint, score: number, justification: string): Promise<`0x${string}`>;
}

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
}

export interface TagitAgentClient {
  identity: IdentityReadMethods & Partial<IdentityWriteMethods>;
  reputation: ReputationReadMethods & Partial<ReputationWriteMethods>;
  validation: ValidationReadMethods & Partial<ValidationWriteMethods>;
  events: EventMethods;
  publicClient: PublicClient;
  walletClient?: WalletClient;
}
