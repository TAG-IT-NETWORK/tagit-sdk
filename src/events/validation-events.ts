import type { Address, PublicClient } from "viem";
import { agentValidationAbi } from "../abi/agent-validation.js";

/**
 * Watch for `ValidationRequested` events on the TAGITAgentValidation contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - TAGITAgentValidation contract address.
 * @param onLogs - Callback invoked with parsed log entries.
 * @returns An unsubscribe function that stops the watcher.
 */
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

/**
 * Watch for `ValidationFinalized` events on the TAGITAgentValidation contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - TAGITAgentValidation contract address.
 * @param onLogs - Callback invoked with parsed log entries.
 * @returns An unsubscribe function that stops the watcher.
 */
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
