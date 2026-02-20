import type { Address, PublicClient } from "viem";
import { agentValidationAbi } from "../abi/agent-validation.js";

export function watchValidationRequested(
  publicClient: PublicClient,
  address: Address,
  onLogs: (
    logs: readonly { requestId: bigint; agentId: bigint; requester: Address; isDefense: boolean }[],
  ) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: agentValidationAbi,
    eventName: "ValidationRequested",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          requestId: l.args.requestId!,
          agentId: l.args.agentId!,
          requester: l.args.requester!,
          isDefense: l.args.isDefense!,
        })),
      );
    },
  });
}

export function watchValidationFinalized(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { requestId: bigint; agentId: bigint; passed: boolean; finalScore: bigint }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: agentValidationAbi,
    eventName: "ValidationFinalized",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          requestId: l.args.requestId!,
          agentId: l.args.agentId!,
          passed: l.args.passed!,
          finalScore: l.args.finalScore!,
        })),
      );
    },
  });
}
