import type { Address, PublicClient, WalletClient } from "viem";
import { agentReputationAbi } from "../abi/agent-reputation.js";
import { ContractError } from "../errors/index.js";
import type { ReputationReadMethods, ReputationWriteMethods } from "../types/client.js";

const abi = agentReputationAbi;

export function createReputationReader(
  publicClient: PublicClient,
  address: Address,
): ReputationReadMethods {
  return {
    async getSummary(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getSummary", args: [agentId] });
      } catch (e) {
        throw new ContractError(`getSummary failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "getSummary", { cause: e });
      }
    },
    async getFeedback(feedbackId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getFeedback", args: [feedbackId] });
      } catch (e) {
        throw new ContractError(`getFeedback failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "getFeedback", { cause: e });
      }
    },
    async readAllFeedback(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "readAllFeedback", args: [agentId] });
      } catch (e) {
        throw new ContractError(`readAllFeedback failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "readAllFeedback", { cause: e });
      }
    },
    async getAgentFeedbackIds(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentFeedbackIds", args: [agentId] });
      } catch (e) {
        throw new ContractError(`getAgentFeedbackIds failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "getAgentFeedbackIds", { cause: e });
      }
    },
    async getReviewerFeedback(reviewer: Address, agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getReviewerFeedback", args: [reviewer, agentId] });
      } catch (e) {
        throw new ContractError(`getReviewerFeedback failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "getReviewerFeedback", { cause: e });
      }
    },
  };
}

export function createReputationWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): ReputationWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", "TAGITAgentReputation", "getAccount");
    return account;
  }

  return {
    async giveFeedback(agentId: bigint, rating: number, comment: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "giveFeedback", args: [agentId, rating, comment], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`giveFeedback failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "giveFeedback", { cause: e });
      }
    },
    async revokeFeedback(feedbackId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "revokeFeedback", args: [feedbackId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`revokeFeedback failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "revokeFeedback", { cause: e });
      }
    },
    async appendResponse(feedbackId: bigint, responseText: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "appendResponse", args: [feedbackId, responseText], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`appendResponse failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentReputation", "appendResponse", { cause: e });
      }
    },
  };
}
