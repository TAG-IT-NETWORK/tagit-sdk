import type { Address } from "viem";

/** On-chain agent lifecycle status, matching the TAGITAgentIdentity contract enum. */
export enum AgentStatus {
  /** Agent has been registered but not yet activated. */
  Registered = 0,
  /** Agent is active and operational. */
  Active = 1,
  /** Agent has been temporarily suspended by the registrant or governance. */
  Suspended = 2,
  /** Agent has been permanently decommissioned. */
  Decommissioned = 3,
}

/** On-chain validation request lifecycle status. */
export enum RequestStatus {
  /** Request is open and awaiting validator responses. */
  Pending = 0,
  /** Validation passed (quorum reached with passing score). */
  Passed = 1,
  /** Validation failed (quorum reached with failing score). */
  Failed = 2,
  /** Request expired before quorum was reached. */
  Expired = 3,
}

/** On-chain agent record from the TAGITAgentIdentity contract. */
export interface Agent {
  /** Address of the human operator who registered the agent. */
  registrant: Address;
  /** Agent's operational wallet address. */
  wallet: Address;
  /** Unix timestamp (seconds) of registration. */
  registeredAt: bigint;
  /** Whether the agent is currently active. */
  active: boolean;
}

/** On-chain feedback record from the TAGITAgentReputation contract. */
export interface Feedback {
  /** Address of the reviewer who submitted the feedback. */
  reviewer: Address;
  /** Agent ID that the feedback targets. */
  agentId: bigint;
  /** Numeric rating (1-5). */
  rating: number;
  /** Reviewer's comment text. */
  comment: string;
  /** Agent owner's response text (empty string if none). */
  response: string;
  /** Unix timestamp (seconds) of feedback submission. */
  timestamp: bigint;
  /** Whether the feedback has been revoked by the reviewer. */
  revoked: boolean;
}

/** Aggregated reputation summary for an agent. */
export interface ReputationSummary {
  /** Total number of feedback entries ever created. */
  totalFeedback: bigint;
  /** Number of non-revoked feedback entries. */
  activeFeedback: bigint;
  /** Average rating across active feedback (scaled). */
  averageRating: bigint;
  /** Weighted reputation score. */
  weightedScore: bigint;
  /** Unix timestamp of the most recent feedback. */
  lastFeedbackAt: bigint;
}

/** On-chain validation request record. */
export interface ValidationRequest {
  /** Agent ID being validated. */
  agentId: bigint;
  /** Address that initiated the validation request. */
  requester: Address;
  /** Number of validator responses required. */
  quorum: number;
  /** Number of responses received so far. */
  responseCount: number;
  /** Unix timestamp of request creation. */
  createdAt: bigint;
  /** Current request lifecycle status. */
  status: RequestStatus;
  /** Whether this is a defense validation (agent-initiated). */
  isDefense: boolean;
}

/** Individual validator response to a validation request. */
export interface ValidatorResponse {
  /** Validator's address. */
  validator: Address;
  /** Score assigned by the validator (0-100). */
  score: number;
  /** Written justification for the score. */
  justification: string;
  /** Unix timestamp of the response. */
  timestamp: bigint;
}

/** Aggregated validation summary for an agent. */
export interface ValidationSummary {
  /** Total number of validation requests. */
  totalRequests: bigint;
  /** Number of requests that passed. */
  passedCount: bigint;
  /** Number of requests that failed. */
  failedCount: bigint;
  /** Most recent validation score. */
  latestScore: bigint;
  /** Unix timestamp of the most recent validation. */
  lastValidatedAt: bigint;
  /** Whether the agent is currently considered validated. */
  isValidated: boolean;
}

/** Compact validation status for an agent. */
export interface ValidationStatus {
  /** Whether the agent is currently considered validated. */
  isValidated: boolean;
  /** Most recent validation score. */
  latestScore: bigint;
  /** Unix timestamp of the most recent validation. */
  lastValidatedAt: bigint;
}

/** Aggregated stats for a validator address. */
export interface ValidatorStats {
  /** Total number of validation responses submitted. */
  totalResponses: bigint;
  /** Number of responses that aligned with the final outcome. */
  accurateResponses: bigint;
  /** Unix timestamp of the validator's most recent response. */
  lastResponseAt: bigint;
}
