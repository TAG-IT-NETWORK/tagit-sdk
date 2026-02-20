import type { Address, PublicClient } from "viem";
import { agentIdentityAbi } from "../abi/agent-identity.js";

export function watchAgentRegistered(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { agentId: bigint; registrant: Address; wallet: Address; uri: string }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: agentIdentityAbi,
    eventName: "AgentRegistered",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          agentId: l.args.agentId!,
          registrant: l.args.registrant!,
          wallet: l.args.wallet!,
          uri: l.args.uri!,
        })),
      );
    },
  });
}

export function watchAgentStatusChanged(
  publicClient: PublicClient,
  address: Address,
  onLogs: (logs: readonly { agentId: bigint; oldStatus: number; newStatus: number }[]) => void,
): () => void {
  return publicClient.watchContractEvent({
    address,
    abi: agentIdentityAbi,
    eventName: "AgentStatusChanged",
    onLogs(logs) {
      onLogs(
        logs.map((l) => ({
          agentId: l.args.agentId!,
          oldStatus: l.args.oldStatus!,
          newStatus: l.args.newStatus!,
        })),
      );
    },
  });
}
