import { defineChain } from "viem";

/**
 * OP Sepolia chain definition used as the default network for the SDK.
 *
 * Chain ID: `11155420`. Uses the public Optimism Sepolia RPC and Blockscout explorer.
 */
export const opSepolia = defineChain({
  id: 11155420,
  name: "OP Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.optimism.io"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://optimism-sepolia.blockscout.com",
    },
  },
  testnet: true,
});
