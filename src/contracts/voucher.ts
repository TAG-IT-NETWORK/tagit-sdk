import type { Address, PublicClient, WalletClient } from "viem";
import { voucherAbi } from "../abi/voucher.js";
import { ContractError } from "../errors/index.js";
import type { VoucherReadMethods, VoucherWriteMethods } from "../types/voucher.js";

const abi = voucherAbi;
const CONTRACT_NAME = "Voucher";

/**
 * Create read-only methods for the Voucher (non-transferable reward) contract.
 * Vouchers are issued by TAGITCore and redeemable for wTAG.
 */
export function createVoucherReader(
  publicClient: PublicClient,
  address: Address,
): VoucherReadMethods {
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
    async core() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "core" });
      } catch (e) {
        throw new ContractError(`core failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "core", { cause: e });
      }
    },
    async wtag() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "wtag" });
      } catch (e) {
        throw new ContractError(`wtag failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "wtag", { cause: e });
      }
    },
    async redemptionRate() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "redemptionRate" });
      } catch (e) {
        throw new ContractError(`redemptionRate failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "redemptionRate", { cause: e });
      }
    },
    async isRedemptionPaused() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "isRedemptionPaused" });
      } catch (e) {
        throw new ContractError(`isRedemptionPaused failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "isRedemptionPaused", { cause: e });
      }
    },
    async version() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "version" });
      } catch (e) {
        throw new ContractError(`version failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "version", { cause: e });
      }
    },
    async owner() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "owner" });
      } catch (e) {
        throw new ContractError(`owner failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "owner", { cause: e });
      }
    },
    async basisPoints() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "BASIS_POINTS" });
      } catch (e) {
        throw new ContractError(`basisPoints failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "basisPoints", { cause: e });
      }
    },
  };
}

/**
 * Create write methods for the Voucher contract.
 * All write methods simulate first, then send the transaction, returning a tx hash.
 */
export function createVoucherWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): VoucherWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", CONTRACT_NAME, "getAccount");
    return account;
  }

  return {
    async issue(to: Address, amount: bigint, tokenId: bigint, reason: string) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "issue", args: [to, amount, tokenId, reason], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`issue failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "issue", { cause: e });
      }
    },
    async burnFrom(from: Address, amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "burnFrom", args: [from, amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`burnFrom failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "burnFrom", { cause: e });
      }
    },
    async redeem(amount: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "redeem", args: [amount], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`redeem failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "redeem", { cause: e });
      }
    },
    async setRedemptionRate(newRate: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "setRedemptionRate", args: [newRate], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`setRedemptionRate failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "setRedemptionRate", { cause: e });
      }
    },
    async setRedemptionPaused(paused: boolean) {
      try {
        const { request } = await publicClient.simulateContract({
          address, abi, functionName: "setRedemptionPaused", args: [paused], account: getAccount(),
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`setRedemptionPaused failed: ${e instanceof Error ? e.message : String(e)}`, CONTRACT_NAME, "setRedemptionPaused", { cause: e });
      }
    },
  };
}
