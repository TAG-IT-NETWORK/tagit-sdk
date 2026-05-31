import type { Abi } from "viem";

/**
 * ABI for the Voucher (non-transferable reward token) contract.
 * ERC-20 base with blocked transfers, redeemable for wTAG.
 */
export const voucherAbi = [
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint8" }],
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
    "name": "balanceOf",
    "inputs": [{ "name": "account", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "core",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "wtag",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "redemptionRate",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isRedemptionPaused",
    "inputs": [],
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "version",
    "inputs": [],
    "outputs": [{ "name": "", "type": "string" }],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "BASIS_POINTS",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MAX_REDEMPTION_RATE",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "MIN_REDEMPTION_RATE",
    "inputs": [],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [{ "name": "", "type": "address" }],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "issue",
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "amount", "type": "uint256" },
      { "name": "tokenId", "type": "uint256" },
      { "name": "reason", "type": "string" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "burnFrom",
    "inputs": [
      { "name": "from", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "redeem",
    "inputs": [{ "name": "amount", "type": "uint256" }],
    "outputs": [{ "name": "wtagAmount", "type": "uint256" }],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setRedemptionRate",
    "inputs": [{ "name": "newRate", "type": "uint256" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setRedemptionPaused",
    "inputs": [{ "name": "paused", "type": "bool" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setCore",
    "inputs": [{ "name": "newCore", "type": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setWtag",
    "inputs": [{ "name": "newWtag", "type": "address" }],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "VoucherIssued",
    "inputs": [
      { "name": "to", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false },
      { "name": "tokenId", "type": "uint256", "indexed": true },
      { "name": "reason", "type": "string", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "VoucherRedeemed",
    "inputs": [
      { "name": "account", "type": "address", "indexed": true },
      { "name": "voucherAmount", "type": "uint256", "indexed": false },
      { "name": "wtagAmount", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "VoucherBurned",
    "inputs": [
      { "name": "from", "type": "address", "indexed": true },
      { "name": "amount", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "CoreUpdated",
    "inputs": [
      { "name": "previousCore", "type": "address", "indexed": true },
      { "name": "newCore", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "WtagUpdated",
    "inputs": [
      { "name": "previousWtag", "type": "address", "indexed": true },
      { "name": "newWtag", "type": "address", "indexed": true }
    ]
  },
  {
    "type": "event",
    "name": "RedemptionRateUpdated",
    "inputs": [
      { "name": "oldRate", "type": "uint256", "indexed": false },
      { "name": "newRate", "type": "uint256", "indexed": false }
    ]
  },
  {
    "type": "event",
    "name": "RedemptionPauseToggled",
    "inputs": [
      { "name": "paused", "type": "bool", "indexed": false }
    ]
  }
] as const satisfies Abi;
