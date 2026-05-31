import type { Address, PublicClient, WalletClient } from "viem";
import { agentIdentityAbi } from "../abi/agent-identity.js";
import { ContractError } from "../errors/index.js";
import type { AgentInfo, AgentReadMethods, AgentWriteMethods } from "../types/agent-identity.js";

const abi = agentIdentityAbi;
const CONTRACT_NAME = "TAGITAgentIdentity";

/**
 * Create the unified AgentClient reader.
 * Wraps TAGITAgentIdentity contract with a simplified, domain-focused API.
 */
export function createAgentReader(
  publicClient: PublicClient,
  address: Address,
): AgentReadMethods {
  return {
    async getAgent(agentId: bigint): Promise<AgentInfo> {
      try {
        const result = await publicClient.readContract({
          address, abi, functionName: "getAgent", args: [agentId],
        });
        return {
          agentId,
          registrant: result[0],
          wallet: result[1],
          registeredAt: result[2],
          active: result[3],
        };
      } catch (e) {
        throw new ContractError(`getAgent failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "getAgent", { cause: e });
      }
    },
    async isRegistered(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "isActiveAgent", args: [agentId] });
      } catch (e) {
        throw new ContractError(`isRegistered failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "isActiveAgent", { cause: e });
      }
    },
    async agentOf(wallet: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentByWallet", args: [wallet] });
      } catch (e) {
        throw new ContractError(`agentOf failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "getAgentByWallet", { cause: e });
      }
    },
    async getAllAgents(registrant: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentsByRegistrant", args: [registrant] });
      } catch (e) {
        throw new ContractError(`getAllAgents failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "getAgentsByRegistrant", { cause: e });
      }
    },
    async getAgentStatus(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentStatus", args: [agentId] });
      } catch (e) {
        throw new ContractError(`getAgentStatus failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "getAgentStatus", { cause: e });
      }
    },
    async totalAgents() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "totalAgents" });
      } catch (e) {
        throw new ContractError(`totalAgents failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "totalAgents", { cause: e });
      }
    },
    async tokenURI(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "tokenURI", args: [agentId] });
      } catch (e) {
        throw new ContractError(`tokenURI failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "tokenURI", { cause: e });
      }
    },
  };
}

/**
 * Create the unified AgentClient writer.
 * Provides register/update/deregister methods that map to TAGITAgentIdentity functions.
 */
export function createAgentWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): AgentWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", CONTRACT_NAME, "getAccount");
    return account;
  }

  return {
    async register(wallet: Address, uri: string, value?: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "register", args: [wallet, uri], account: getAccount(), value,
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`register failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "register", { cause: e });
      }
    },
    async activate(agentId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "activateAgent", args: [agentId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`activate failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "activateAgent", { cause: e });
      }
    },
    async update(agentId: bigint, uri: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "setAgentURI", args: [agentId, uri], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`update failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "setAgentURI", { cause: e });
      }
    },
    async deregister(agentId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "decommissionAgent", args: [agentId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`deregister failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "decommissionAgent", { cause: e });
      }
    },
  };
}
