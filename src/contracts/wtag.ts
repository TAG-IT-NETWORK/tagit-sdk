import type { Address, PublicClient, WalletClient } from "viem";
import { wtagAbi } from "../abi/wtag.js";
import { ContractError } from "../errors/index.js";
import type { WTagReadMethods, WTagWriteMethods } from "../types/wtag.js";

const abi = wtagAbi;
const CONTRACT_NAME = "wTAG";

/**
 * Create read-only methods for the wTAG governance token contract.
 * All methods return typed values via viem readContract calls.
 */
export function createWTagReader(
  publicClient: PublicClient,
  address: Address,
): WTagReadMethods {
  return {
    async name() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "name" });
      } catch (e) {
        throw new ContractError(`name failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "name", { cause: e });
      }
    },
    async symbol() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "symbol" });
      } catch (e) {
        throw new ContractError(`symbol failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "symbol", { cause: e });
      }
    },
    async decimals() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "decimals" });
      } catch (e) {
        throw new ContractError(`decimals failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "decimals", { cause: e });
      }
    },
    async totalSupply() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "totalSupply" });
      } catch (e) {
        throw new ContractError(`totalSupply failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "totalSupply", { cause: e });
      }
    },
    async balanceOf(account: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "balanceOf", args: [account] });
      } catch (e) {
        throw new ContractError(`balanceOf failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "balanceOf", { cause: e });
      }
    },
    async allowance(owner: Address, spender: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "allowance", args: [owner, spender] });
      } catch (e) {
        throw new ContractError(`allowance failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "allowance", { cause: e });
      }
    },
    async underlyingToken() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "underlyingToken" });
      } catch (e) {
        throw new ContractError(`underlyingToken failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "underlyingToken", { cause: e });
      }
    },
    async isMinter(account: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "isMinter", args: [account] });
      } catch (e) {
        throw new ContractError(`isMinter failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "isMinter", { cause: e });
      }
    },
    async version() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "version" });
      } catch (e) {
        throw new ContractError(`version failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "version", { cause: e });
      }
    },
    async delegates(account: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "delegates", args: [account] });
      } catch (e) {
        throw new ContractError(`delegates failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "delegates", { cause: e });
      }
    },
    async getVotes(account: Address) {
      try {
        return await publicClient.readContract({ address, abi, functionName: "getVotes", args: [account] });
      } catch (e) {
        throw new ContractError(`getVotes failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "getVotes", { cause: e });
      }
    },
  };
}

/**
 * Create write methods for the wTAG governance token contract.
 * All write methods simulate first, then send the transaction, returning a tx hash.
 */
export function createWTagWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): WTagWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", CONTRACT_NAME, "getAccount");
    return account;
  }

  return {
    async wrap(amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "wrap", args: [amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`wrap failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "wrap", { cause: e });
      }
    },
    async unwrap(amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "unwrap", args: [amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`unwrap failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "unwrap", { cause: e });
      }
    },
    async transfer(to: Address, amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "transfer", args: [to, amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`transfer failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "transfer", { cause: e });
      }
    },
    async approve(spender: Address, amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "approve", args: [spender, amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`approve failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "approve", { cause: e });
      }
    },
    async transferFrom(from: Address, to: Address, amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "transferFrom", args: [from, to, amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`transferFrom failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "transferFrom", { cause: e });
      }
    },
    async delegate(delegatee: Address) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "delegate", args: [delegatee], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`delegate failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "delegate", { cause: e });
      }
    },
  };
}
