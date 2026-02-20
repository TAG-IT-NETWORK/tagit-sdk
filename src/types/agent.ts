import type { Address } from "viem";

export enum AgentStatus {
  Registered = 0,
  Active = 1,
  Suspended = 2,
  Decommissioned = 3,
}

export enum RequestStatus {
  Pending = 0,
  Passed = 1,
  Failed = 2,
  Expired = 3,
}

export interface Agent {
  registrant: Address;
  wallet: Address;
  registeredAt: bigint;
  active: boolean;
}

export interface Feedback {
  reviewer: Address;
  agentId: bigint;
  rating: number;
  comment: string;
  response: string;
  timestamp: bigint;
  revoked: boolean;
}

export interface ReputationSummary {
  totalFeedback: bigint;
  activeFeedback: bigint;
  averageRating: bigint;
  weightedScore: bigint;
  lastFeedbackAt: bigint;
}

export interface ValidationRequest {
  agentId: bigint;
  requester: Address;
  quorum: number;
  responseCount: number;
  createdAt: bigint;
  status: RequestStatus;
  isDefense: boolean;
}

export interface ValidatorResponse {
  validator: Address;
  score: number;
  justification: string;
  timestamp: bigint;
}

export interface ValidationSummary {
  totalRequests: bigint;
  passedCount: bigint;
  failedCount: bigint;
  latestScore: bigint;
  lastValidatedAt: bigint;
  isValidated: boolean;
}

export interface ValidationStatus {
  isValidated: boolean;
  latestScore: bigint;
  lastValidatedAt: bigint;
}

export interface ValidatorStats {
  totalResponses: bigint;
  accurateResponses: bigint;
  lastResponseAt: bigint;
}
