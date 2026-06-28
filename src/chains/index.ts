import { defineChain } from "viem";

/**
 * Base Sepolia chain definition used as the default network for the SDK.
 *
 * Chain ID: `84532`. Uses the public Base Sepolia RPC and BaseScan explorer.
 *
 * Archived: OP Sepolia + Arbitrum Sepolia deployments deprecated 2026-06-27 (history in tagit-contracts).
 */
export const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.base.org"] },
  },
  blockExplorers: {
    default: {
      name: "BaseScan",
      url: "https://sepolia.basescan.org",
    },
  },
  testnet: true,
});
