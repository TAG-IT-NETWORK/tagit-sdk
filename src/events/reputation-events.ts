import type { Address, PublicClient } from "viem";
import { agentReputationAbi } from "../abi/agent-reputation.js";

export function watchFeedbackGiven(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { feedbackId: bigint; agentId: bigint; reviewer: Address; rating: number }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: agentReputationAbi,
    eventName: "FeedbackGiven",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          feedbackId: l.args.feedbackId!,
          agentId: l.args.agentId!,
          reviewer: l.args.reviewer!,
          rating: l.args.rating!,
        })),
      );
    },
  });
}

export function watchFeedbackRevoked(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { feedbackId: bigint; agentId: bigint }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: agentReputationAbi,
    eventName: "FeedbackRevoked",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          feedbackId: l.args.feedbackId!,
          agentId: l.args.agentId!,
        })),
      );
    },
  });
}
