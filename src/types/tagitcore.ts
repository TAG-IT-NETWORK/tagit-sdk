import type { Address, Hash, Hex } from "viem";

/** Asset lifecycle states (matches the TAGITCore Solidity enum). */
export enum AssetState {
  None = 0,
  Minted = 1,
  Bound = 2,
  Activated = 3,
  Claimed = 4,
  Flagged = 5,
  Recycled = 6,
}

/** Decoded `getAsset` result. */
export interface AssetData {
  owner: Address;
  timestamp: bigint;
  state: AssetState;
  flags: number;
  reserved: number;
}

/** 2-of-3 resolve quorum status for a flagged asset. */
export interface ResolveApprovalStatus {
  approvalCount: bigint;
  recipient: Address;
  quorumReached: boolean;
}

export interface TagitCoreReadMethods {
  /** Full asset record (owner, timestamp, state, flags, reserved). */
  getAsset(tokenId: bigint): Promise<AssetData>;
  /** Tag hash bound to a token (bytes32(0) if unbound). */
  getTagByToken(tokenId: bigint): Promise<Hex>;
  /** Token bound to a tag hash (0 if none). */
  getTokenByTag(tagHash: Hex): Promise<bigint>;
  /** Current resolve-quorum status for a flagged asset. */
  getResolveApprovalStatus(tokenId: bigint): Promise<ResolveApprovalStatus>;
  /** ERC-721 owner of a token. */
  ownerOf(tokenId: bigint): Promise<Address>;
  /** Total minted supply. */
  totalSupply(): Promise<bigint>;
  /** Number of resolver approvals required (2-of-3). */
  resolveQuorum(): Promise<bigint>;
}

export interface TagitCoreWriteMethods {
  /** NONE → MINTED. Requires MINTER. */
  mint(to: Address, metadata: Hex): Promise<Hash>;
  /** MINTED → BOUND. Requires BINDER + oracle attestation. */
  bindTag(tokenId: bigint, tagHash: Hex, challengeResponse: Hex, oracleSignature: Hex): Promise<Hash>;
  /** BOUND → ACTIVATED. Requires ACTIVATOR. */
  activate(tokenId: bigint): Promise<Hash>;
  /** ACTIVATED → CLAIMED. Requires CLAIMER. */
  claim(tokenId: bigint, newOwner: Address): Promise<Hash>;
  /** {BOUND|ACTIVATED|CLAIMED} → FLAGGED (recall / theft / lost-stolen). Requires FLAGGER. */
  flag(tokenId: bigint): Promise<Hash>;
  /** Cast one of the 2-of-3 resolve approvals. Requires RESOLVER. */
  approveResolve(tokenId: bigint, newOwner: Address): Promise<Hash>;
  /** FLAGGED → exact pre-flag state (recovery). Requires RESOLVER + quorum. */
  resolve(tokenId: bigint, newOwner: Address): Promise<Hash>;
  /** {MINTED|BOUND|ACTIVATED|CLAIMED|FLAGGED} → RECYCLED (void / scrap / EOL). Requires RECYCLER. */
  recycle(tokenId: bigint): Promise<Hash>;
  /** CLAIMED → CLAIMED secondary-market resale (owner-gated; new owner). */
  transferAsset(tokenId: bigint, to: Address): Promise<Hash>;
}
