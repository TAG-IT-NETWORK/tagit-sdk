import type { Address, PublicClient, WalletClient } from "viem";
import { reputationStakingAbi } from "../abi/reputation-staking.js";
import { ContractError } from "../errors/index.js";
import type { StakingReadMethods, StakingWriteMethods } from "../types/client.js";

const abi = reputationStakingAbi;

/**
 * Create read-only methods for the ReputationStaking contract.
 *
 * @param publicClient - viem public client connected to the target chain.
 * @param address - Deployed ReputationStaking contract address.
 * @returns An object implementing {@link StakingReadMethods}.
 * @throws {ContractError} When any underlying contract read fails.
 */
export function createStakingReader(
  publicClient: PublicClient,
  address: Address,
): StakingReadMethods {
  return {
    async getAgentStake(agentId: bigint) {
      try {
        return await publicClient.readContract({
          address, abi, functionName: "getStake", args: [agentId],
        });
      } catch (e) {
        throw new ContractError(`getStake failed: ${e instanceof Error ? e.message : String(e)}`, "ReputationStaking", "getStake", { cause: e });
      }
    },
    async getMinBond() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getMinBond" });
      } catch (e) {
        throw new ContractError(`getMinBond failed: ${e instanceof Error ? e.message : String(e)}`, "ReputationStaking", "getMinBond", { cause: e });
      }
    },
    async hasMinBond(agentId: bigint) {
      try {
        return await publicClient.readContract({
          address, abi, functionName: "hasMinBond", args: [agentId],
        });
      } catch (e) {
        throw new ContractError(`hasMinBond failed: ${e instanceof Error ? e.message : String(e)}`, "ReputationStaking", "hasMinBond", { cause: e });
      }
    },
    async getStaker(agentId: bigint) {
      try {
        return await publicClient.readContract({
          address, abi, functionName: "getStaker", args: [agentId],
        });
      } catch (e) {
        throw new ContractError(`getStaker failed: ${e instanceof Error ? e.message : String(e)}`, "ReputationStaking", "getStaker", { cause: e });
      }
    },
  };
}

/**
 * Create write methods for the ReputationStaking contract.
 *
 * Each method simulates the transaction before broadcasting.
 *
 * @param walletClient - viem wallet client with an attached account.
 * @param publicClient - viem public client for simulation.
 * @param address - Deployed ReputationStaking contract address.
 * @returns An object implementing {@link StakingWriteMethods}.
 * @throws {ContractError} When the wallet has no account or a transaction reverts.
 */
export function createStakingWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): StakingWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", "ReputationStaking", "getAccount");
    return account;
  }

  return {
    async stake(agentId: bigint, amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "stake", args: [agentId, amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`stake failed: ${e instanceof Error ? e.message : String(e)}`, "ReputationStaking", "stake", { cause: e });
      }
    },
    async unstake(agentId: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "unstake", args: [agentId], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`unstake failed: ${e instanceof Error ? e.message : String(e)}`, "ReputationStaking", "unstake", { cause: e });
      }
    },
  };
}
