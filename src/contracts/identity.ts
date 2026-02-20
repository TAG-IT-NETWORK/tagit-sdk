import type { Address, PublicClient, WalletClient } from "viem";
import { agentIdentityAbi } from "../abi/agent-identity.js";
import { ContractError } from "../errors/index.js";
import type { IdentityReadMethods, IdentityWriteMethods } from "../types/client.js";

const abi = agentIdentityAbi;

export function createIdentityReader(
  publicClient: PublicClient,
  address: Address,
): IdentityReadMethods {
  return {
    async getAgent(agentId: bigint) {
      try {
        const result = await publicClient.readContract({
          address, abi, functionName: "getAgent", args: [agentId],
        });
        return {
          registrant: result[0],
          wallet: result[1],
          registeredAt: result[2],
          active: result[3],
        };
      } catch (e) {
        throw new ContractError(`getAgent failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "getAgent", { cause: e });
      }
    },
    async getAgentStatus(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentStatus", args: [agentId] });
      } catch (e) {
        throw new ContractError(`getAgentStatus failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "getAgentStatus", { cause: e });
      }
    },
    async getAgentByWallet(wallet: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentByWallet", args: [wallet] });
      } catch (e) {
        throw new ContractError(`getAgentByWallet failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "getAgentByWallet", { cause: e });
      }
    },
    async getAgentsByRegistrant(registrant: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getAgentsByRegistrant", args: [registrant] });
      } catch (e) {
        throw new ContractError(`getAgentsByRegistrant failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "getAgentsByRegistrant", { cause: e });
      }
    },
    async getMetadata(agentId: bigint, key: string) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getMetadata", args: [agentId, key] });
      } catch (e) {
        throw new ContractError(`getMetadata failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "getMetadata", { cause: e });
      }
    },
    async isActiveAgent(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "isActiveAgent", args: [agentId] });
      } catch (e) {
        throw new ContractError(`isActiveAgent failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "isActiveAgent", { cause: e });
      }
    },
    async totalAgents() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "totalAgents" });
      } catch (e) {
        throw new ContractError(`totalAgents failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "totalAgents", { cause: e });
      }
    },
    async registrationFee() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "registrationFee" });
      } catch (e) {
        throw new ContractError(`registrationFee failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "registrationFee", { cause: e });
      }
    },
    async tokenURI(agentId: bigint) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "tokenURI", args: [agentId] });
      } catch (e) {
        throw new ContractError(`tokenURI failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "tokenURI", { cause: e });
      }
    },
  };
}

export function createIdentityWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): IdentityWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", "TAGITAgentIdentity", "getAccount");
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
        throw new ContractError(`register failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "register", { cause: e });
      }
    },
    async setAgentURI(agentId: bigint, uri: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "setAgentURI", args: [agentId, uri], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`setAgentURI failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "setAgentURI", { cause: e });
      }
    },
    async setMetadata(agentId: bigint, key: string, value: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "setMetadata", args: [agentId, key, value], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`setMetadata failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "setMetadata", { cause: e });
      }
    },
    async suspendAgent(agentId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "suspendAgent", args: [agentId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`suspendAgent failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "suspendAgent", { cause: e });
      }
    },
    async reactivateAgent(agentId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "reactivateAgent", args: [agentId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`reactivateAgent failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "reactivateAgent", { cause: e });
      }
    },
    async decommissionAgent(agentId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "decommissionAgent", args: [agentId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`decommissionAgent failed: ${e instanceof Error ? e.message : String(e)}`, "TAGITAgentIdentity", "decommissionAgent", { cause: e });
      }
    },
  };
}
