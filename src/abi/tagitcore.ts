import type { Abi } from "viem";

/**
 * ABI for the TAGITCore lifecycle contract (digital-twin state machine).
 *
 * Covers the asset lifecycle surface — including the 2026-05-30 recall/scrap/
 * resale upgrade: `flag` is valid from BOUND/ACTIVATED/CLAIMED, `resolve`
 * restores the exact pre-flag state, `recycle` works from any live state, and
 * `transferAsset` is the owner-gated secondary-market resale.
 *
 * State enum: NONE=0, MINTED=1, BOUND=2, ACTIVATED=3, CLAIMED=4, FLAGGED=5, RECYCLED=6.
 */
export const tagitCoreAbi = [
  // ── Reads ────────────────────────────────────────────────────────────────
  {
    "type": "function",
    "name": "getAsset",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [
      { "name": "owner", "type": "address" },
      { "name": "timestamp", "type": "uint64" },
      { "name": "state", "type": "uint8" },
      { "name": "flags", "type": "uint8" },
      { "name": "reserved", "type": "uint16" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTagByToken",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "bytes32" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTokenByTag",
    "inputs": [{ "name": "tagHash", "type": "bytes32" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getResolveApprovalStatus",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [
      { "name": "approvalCount", "type": "uint256" },
      { "name": "recipient", "type": "address" },
      { "name": "quorumReached", "type": "bool" }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ownerOf",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalSupply",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "RESOLVE_QUORUM",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  // ── Writes (lifecycle transitions) ─────────────────────────────────────────
  {
    "type": "function",
    "name": "mint",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "metadata", "type": "bytes32" }
    ],
    "outputs": [{ "name": "tokenId", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "bindTag",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "tagHash", "type": "bytes32" },
      { "name": "challengeResponse", "type": "bytes" },
      { "name": "oracleSignature", "type": "bytes" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "activate",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "claim",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "newOwner", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "flag",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "approveResolve",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "newOwner", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resolve",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "newOwner", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "recycle",
    "inputs": [{ "name": "tokenId", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "transferAsset",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "to", "type": "address" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  // ── Events ─────────────────────────────────────────────────────────────────
  {
    "type": "event",
    "name": "AssetMinted",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "to", "type": "address", "indexed": true },
      { "name": "metadata", "type": "bytes32", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "StateChanged",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "from", "type": "uint8", "indexed": false },
      { "name": "to", "type": "uint8", "indexed": false },
      { "name": "actor", "type": "address", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "TagBound",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "tagHash", "type": "bytes32", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "AssetResold",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "from", "type": "address", "indexed": true },
      { "name": "to", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "CustodyTransfer",
    "inputs": [
      { "name": "assetId", "type": "uint256", "indexed": true },
      { "name": "fromState", "type": "uint8", "indexed": false },
      { "name": "toState", "type": "uint8", "indexed": false },
      { "name": "fromOwner", "type": "address", "indexed": true },
      { "name": "toOwner", "type": "address", "indexed": true },
      { "name": "timestamp", "type": "uint256", "indexed": false },
      { "name": "prevStateHash", "type": "bytes32", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "ResolveApproved",
    "inputs": [
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "approver", "type": "address", "indexed": true },
      { "name": "approvalCount", "type": "uint256", "indexed": false }
    ]
  },
  // ── Errors ───────────────────────────────────────────────────────────────
  { "type": "error", "name": "TokenNotFound", "inputs": [{ "name": "tokenId", "type": "uint256" }] },
  {
    "type": "error",
    "name": "InvalidState",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "current", "type": "uint8" },
      { "name": "required", "type": "uint8" }
    ]
  },
  {
    "type": "error",
    "name": "NotFlaggable",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "current", "type": "uint8" }
    ]
  },
  {
    "type": "error",
    "name": "NotAssetOwner",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "caller", "type": "address" },
      { "name": "owner", "type": "address" }
    ]
  },
  { "type": "error", "name": "ZeroAddress", "inputs": [] },
  { "type": "error", "name": "TagAlreadyBound", "inputs": [{ "name": "tagHash", "type": "bytes32" }] },
  {
    "type": "error",
    "name": "AlreadyApproved",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "approver", "type": "address" }
    ]
  },
  {
    "type": "error",
    "name": "QuorumNotReached",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "current", "type": "uint256" },
      { "name": "required", "type": "uint256" }
    ]
  },
  {
    "type": "error",
    "name": "RecipientMismatch",
    "inputs": [
      { "name": "tokenId", "type": "uint256" },
      { "name": "expected", "type": "address" },
      { "name": "provided", "type": "address" }
    ]
  }
] as const satisfies Abi;
