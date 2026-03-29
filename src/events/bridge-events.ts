import type { Address, PublicClient } from "viem";
import { ccipBridgeAdapterAbi } from "../abi/ccip-bridge-adapter.js";
import type { CrossChainSentLog, CrossChainReceivedLog } from "../types/bridge.js";

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
