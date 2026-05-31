import type { Address, Hex, PublicClient, WalletClient } from "viem";
import { tagitCoreAbi } from "../abi/tagitcore.js";
import { ContractError } from "../errors/index.js";
import type {
  AssetData,
  AssetState,
  ResolveApprovalStatus,
  TagitCoreReadMethods,
  TagitCoreWriteMethods,
} from "../types/tagitcore.js";

const abi = tagitCoreAbi;
const CONTRACT_NAME = "TAGITCore";

/**
 * Create read-only methods for the TAGITCore lifecycle contract.
 *
 * @param publicClient - viem public client connected to the target chain.
 * @param address - Deployed TAGITCore proxy address.
 * @returns An object implementing {@link TagitCoreReadMethods}.
 * @throws {ContractError} When any underlying contract read fails.
 */
export function createTagitCoreReader(
  publicClient: PublicClient,
  address: Address,
): TagitCoreReadMethods {
  return {
    async getAsset(tokenId: bigint): Promise<AssetData> {
      try {
        const [owner, timestamp, state, flags, reserved] = (await publicClient.readContract({
          address,
          abi,
          functionName: "getAsset",
          args: [tokenId],
        })) as readonly [Address, bigint, number, number, number];
        return { owner, timestamp, state: state as AssetState, flags, reserved };
      } catch (e) {
        throw new ContractError(
          `getAsset failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "getAsset",
          { cause: e },
        );
      }
    },
    async getTagByToken(tokenId: bigint): Promise<Hex> {
      try {
        return (await publicClient.readContract({
          address,
          abi,
          functionName: "getTagByToken",
          args: [tokenId],
        })) as Hex;
      } catch (e) {
        throw new ContractError(
          `getTagByToken failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "getTagByToken",
          { cause: e },
        );
      }
    },
    async getTokenByTag(tagHash: Hex): Promise<bigint> {
      try {
        return (await publicClient.readContract({
          address,
          abi,
          functionName: "getTokenByTag",
          args: [tagHash],
        })) as bigint;
      } catch (e) {
        throw new ContractError(
          `getTokenByTag failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "getTokenByTag",
          { cause: e },
        );
      }
    },
    async getResolveApprovalStatus(tokenId: bigint): Promise<ResolveApprovalStatus> {
      try {
        const [approvalCount, recipient, quorumReached] = (await publicClient.readContract({
          address,
          abi,
          functionName: "getResolveApprovalStatus",
          args: [tokenId],
        })) as readonly [bigint, Address, boolean];
        return { approvalCount, recipient, quorumReached };
      } catch (e) {
        throw new ContractError(
          `getResolveApprovalStatus failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "getResolveApprovalStatus",
          { cause: e },
        );
      }
    },
    async ownerOf(tokenId: bigint): Promise<Address> {
      try {
        return (await publicClient.readContract({
          address,
          abi,
          functionName: "ownerOf",
          args: [tokenId],
        })) as Address;
      } catch (e) {
        throw new ContractError(
          `ownerOf failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "ownerOf",
          { cause: e },
        );
      }
    },
    async totalSupply(): Promise<bigint> {
      try {
        return (await publicClient.readContract({ address, abi, functionName: "totalSupply" })) as bigint;
      } catch (e) {
        throw new ContractError(
          `totalSupply failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "totalSupply",
          { cause: e },
        );
      }
    },
    async resolveQuorum(): Promise<bigint> {
      try {
        return (await publicClient.readContract({
          address,
          abi,
          functionName: "RESOLVE_QUORUM",
        })) as bigint;
      } catch (e) {
        throw new ContractError(
          `resolveQuorum failed: ${e instanceof Error ? e.message : String(e)}`,
          CONTRACT_NAME,
          "resolveQuorum",
          { cause: e },
        );
      }
    },
  };
}

/**
 * Create write methods for the TAGITCore lifecycle contract. Each call
 * simulates first (surfacing typed reverts as {@link ContractError}) then
 * broadcasts via the wallet client.
 *
 * @param walletClient - viem wallet client with a connected account.
 * @param publicClient - viem public client for simulation.
 * @param address - Deployed TAGITCore proxy address.
 */
export function createTagitCoreWriter(
  walletClient: WalletClient,
  publicClient: PublicClient,
  address: Address,
): TagitCoreWriteMethods {
  function getAccount() {
    const account = walletClient.account;
    if (!account) throw new ContractError("Wallet client has no account", CONTRACT_NAME, "getAccount");
    return account;
  }

  async function send(functionName: string, args: readonly unknown[]) {
    try {
      const { request } = await publicClient.simulateContract({
        address,
        abi,
        functionName: functionName as never,
        args: args as never,
        account: getAccount(),
      });
      return walletClient.writeContract(request);
    } catch (e) {
      throw new ContractError(
        `${functionName} failed: ${e instanceof Error ? e.message : String(e)}`,
        CONTRACT_NAME,
        functionName,
        { cause: e },
      );
    }
  }

  return {
    mint: (to, metadata) => send("mint", [to, metadata]),
    bindTag: (tokenId, tagHash, challengeResponse, oracleSignature) =>
      send("bindTag", [tokenId, tagHash, challengeResponse, oracleSignature]),
    activate: (tokenId) => send("activate", [tokenId]),
    claim: (tokenId, newOwner) => send("claim", [tokenId, newOwner]),
    flag: (tokenId) => send("flag", [tokenId]),
    approveResolve: (tokenId, newOwner) => send("approveResolve", [tokenId, newOwner]),
    resolve: (tokenId, newOwner) => send("resolve", [tokenId, newOwner]),
    recycle: (tokenId) => send("recycle", [tokenId]),
    transferAsset: (tokenId, to) => send("transferAsset", [tokenId, to]),
  };
}
