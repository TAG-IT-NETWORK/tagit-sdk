import type { Abi } from "viem";

/**
 * Minimal ABI for CCIPBridgeAdapter — read functions, write functions, and events
 * needed by the SDK bridge client.
 */
export const ccipBridgeAdapterAbi = [
  // ── Read Functions ──
  {
    type: "function",
    name: "estimateFee",
    inputs: [
      { name: "destChain", type: "uint64" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "fee", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTransfer",
    inputs: [{ name: "transferId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "transferId", type: "bytes32" },
          { name: "sourceChain", type: "uint64" },
          { name: "destChain", type: "uint64" },
          { name: "sender", type: "address" },
          { name: "recipient", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "timestamp", type: "uint64" },
          { name: "completed", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isDestChainSupported",
    inputs: [{ name: "chainSelector", type: "uint64" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "bridgeMode",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "wTag",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "router",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isPaused",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "lockedBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "version",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "pure",
  },
  // ── Write Functions ──
  {
    type: "function",
    name: "sendCrossChain",
    inputs: [
      { name: "destChain", type: "uint64" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [
      { name: "transferId", type: "bytes32" },
      { name: "ccipMessageId", type: "bytes32" },
    ],
    stateMutability: "payable",
  },
  // ── Events ──
  {
    type: "event",
    name: "CrossChainSent",
    inputs: [
      { name: "transferId", type: "bytes32", indexed: true },
      { name: "ccipMessageId", type: "bytes32", indexed: true },
      { name: "destChain", type: "uint64", indexed: true },
      { name: "sender", type: "address", indexed: false },
      { name: "recipient", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
      { name: "fee", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CrossChainReceived",
    inputs: [
      { name: "transferId", type: "bytes32", indexed: true },
      { name: "ccipMessageId", type: "bytes32", indexed: true },
      { name: "sourceChain", type: "uint64", indexed: true },
      { name: "sender", type: "address", indexed: false },
      { name: "recipient", type: "address", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
    ],
    anonymous: false,
  },
] as const satisfies Abi;
