import type { Address, PublicClient, WalletClient } from "viem";
import { ccipBridgeAdapterAbi } from "../abi/ccip-bridge-adapter.js";
import { ContractError } from "../errors/index.js";
import type {
  BridgeReadMethods,
  BridgeWriteMethods,
  BridgeMode,
  BridgeParams,
  TransferRecord,
} from "../types/bridge.js";

const abi = ccipBridgeAdapterAbi;

/**
 * Create read-only methods for the CCIPBridgeAdapter contract.
 *
 * Provides fee estimation, transfer lookup, and bridge configuration queries.
 *
 * @param publicClient - viem public client connected to the target chain.
 * @param address - Deployed CCIPBridgeAdapter contract address.
 * @returns An object implementing {@link BridgeReadMethods}.
 * @throws {ContractError} When any underlying contract read fails.
 */
export function createBridgeReader(
  publicClient: PublicClient,
  address: Address,
): BridgeReadMethods {
  return {
    async estimateFee(destChainSelector: bigint, recipient: Address, amount: bigint) {
      try {
        return await publicClient.readContract({
          address, abi, functionName: "estimateFee", args: [destChainSelector, recipient, amount],
        });
      } catch (e) {
        throw new ContractError(`estimateFee failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "estimateFee", { cause: e });
      }
    },
    async getTransfer(transferId: `0x${string}`) {
      try {
        const result = await publicClient.readContract({
          address, abi, functionName: "getTransfer", args: [transferId],
        });
        return {
          transferId: result.transferId,
          sourceChain: result.sourceChain,
          destChain: result.destChain,
          sender: result.sender,
          recipient: result.recipient,
          amount: result.amount,
          timestamp: result.timestamp,
          completed: result.completed,
        } as TransferRecord;
      } catch (e) {
        throw new ContractError(`getTransfer failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "getTransfer", { cause: e });
      }
    },
    async isDestChainSupported(chainSelector: bigint) {
      try {
        return await publicClient.readContract({
          address, abi, functionName: "isDestChainSupported", args: [chainSelector],
        });
      } catch (e) {
        throw new ContractError(`isDestChainSupported failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "isDestChainSupported", { cause: e });
      }
    },
    async bridgeMode() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "bridgeMode" }) as BridgeMode;
      } catch (e) {
        throw new ContractError(`bridgeMode failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "bridgeMode", { cause: e });
      }
    },
    async wTag() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "wTag" });
      } catch (e) {
        throw new ContractError(`wTag failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "wTag", { cause: e });
      }
    },
    async router() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "router" });
      } catch (e) {
        throw new ContractError(`router failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "router", { cause: e });
      }
    },
    async isPaused() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "isPaused" });
      } catch (e) {
        throw new ContractError(`isPaused failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "isPaused", { cause: e });
      }
    },
    async lockedBalance() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "lockedBalance" });
      } catch (e) {
        throw new ContractError(`lockedBalance failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "lockedBalance", { cause: e });
      }
    },
    async version() {
      try {
        return await publicClient.readContract({ address, abi, functionName: "version" });
      } catch (e) {
        throw new ContractError(`version failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "version", { cause: e });
      }
    },
  };
}

/**
 * Create write methods for the CCIPBridgeAdapter contract.
 *
 * @param walletClient - viem wallet client with an attached account.
 * @param publicClient - viem public client for simulation.
 * @param address - Deployed CCIPBridgeAdapter contract address.
 * @returns An object implementing {@link BridgeWriteMethods}.
 * @throws {ContractError} When the wallet has no account or a transaction reverts.
 */
export function createBridgeWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): BridgeWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", "CCIPBridgeAdapter", "getAccount");
    return account;
  }

  return {
    async sendCrossChain(params: BridgeParams, feeValue: bigint) {
      try {
        const { request } = await publicClient.simulateContract({
          address,
          abi,
          functionName: "sendCrossChain",
          args: [params.destChainSelector, params.recipient, params.amount],
          account: getAccount(),
          value: feeValue,
        });
        return walletClient.writeContract(request);
      } catch (e) {
        throw new ContractError(`sendCrossChain failed: ${e instanceof Error ? e.message : String(e)}`, "CCIPBridgeAdapter", "sendCrossChain", { cause: e });
      }
    },
  };
}
