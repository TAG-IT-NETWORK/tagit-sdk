import type { Address, PublicClient } from "viem";
import { ccipBridgeAdapterAbi } from "../abi/ccip-bridge-adapter.js";
import type { CrossChainSentLog, CrossChainReceivedLog } from "../types/bridge.js";

/**
 * Watch for `CrossChainSent` events on the CCIPBridgeAdapter contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - CCIPBridgeAdapter contract address.
 * @param onLogs - Callback invoked with parsed {@link CrossChainSentLog} entries.
 * @returns An unsubscribe function that stops the watcher.
 */
export function watchCrossChainSent(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly CrossChainSentLog[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: ccipBridgeAdapterAbi,
    eventName: "CrossChainSent",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          transferId: l.args.transferId!,
          ccipMessageId: l.args.ccipMessageId!,
          destChain: l.args.destChain!,
          sender: l.args.sender!,
          recipient: l.args.recipient!,
          amount: l.args.amount!,
          fee: l.args.fee!,
        })),
      );
    },
  });
}

/**
 * Watch for `CrossChainReceived` events on the CCIPBridgeAdapter contract.
 *
 * @param publicClient - viem public client for event subscription.
 * @param address - CCIPBridgeAdapter contract address.
 * @param onLogs - Callback invoked with parsed {@link CrossChainReceivedLog} entries.
 * @returns An unsubscribe function that stops the watcher.
 */
export function watchCrossChainReceived(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly CrossChainReceivedLog[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: ccipBridgeAdapterAbi,
    eventName: "CrossChainReceived",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          transferId: l.args.transferId!,
          ccipMessageId: l.args.ccipMessageId!,
          sourceChain: l.args.sourceChain!,
          sender: l.args.sender!,
          recipient: l.args.recipient!,
          amount: l.args.amount!,
        })),
      );
    },
  });
}
