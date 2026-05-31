import type { Address, PublicClient } from "viem";
import { reputationStakingAbi } from "../abi/reputation-staking.js";

/**
 * Watch for `StakeDeposited` events on the ReputationStaking contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - ReputationStaking contract address.
 * @param onLogs - Callback invoked with parsed log entries.
 * @returns An unsubscribe function that stops the watcher.
 */
export function watchStakeDeposited(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { agentId: bigint; staker: Address; amount: bigint }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: reputationStakingAbi,
    eventName: "StakeDeposited",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          agentId: l.args.agentId!,
          staker: l.args.staker!,
          amount: l.args.amount!,
        })),
      );
    },
  });
}

/**
 * Watch for `StakeWithdrawn` events on the ReputationStaking contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - ReputationStaking contract address.
 * @param onLogs - Callback invoked with parsed log entries.
 * @returns An unsubscribe function that stops the watcher.
 */
export function watchStakeWithdrawn(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { agentId: bigint; staker: Address; amount: bigint }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: reputationStakingAbi,
    eventName: "StakeWithdrawn",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          agentId: l.args.agentId!,
          staker: l.args.staker!,
          amount: l.args.amount!,
        })),
      );
    },
  });
}

/**
 * Watch for `StakeSlashed` events on the ReputationStaking contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - ReputationStaking contract address.
 * @param onLogs - Callback invoked with parsed log entries.
 * @returns An unsubscribe function that stops the watcher.
 */
export function watchStakeSlashed(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { agentId: bigint; amount: bigint; slashedBy: Address }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: reputationStakingAbi,
    eventName: "StakeSlashed",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          agentId: l.args.agentId!,
          amount: l.args.amount!,
          slashedBy: l.args.slashedBy!,
        })),
      );
    },
  });
}
