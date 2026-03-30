import type { Address } from "viem";

/** Deployed contract addresses for a specific chain. */
export interface ContractAddresses {
  /** TAGITAgentIdentity proxy address. */
  TAGITAgentIdentity: Address;
  /** TAGITAgentReputation proxy address. */
  TAGITAgentReputation: Address;
  /** TAGITAgentValidation proxy address. */
  TAGITAgentValidation: Address;
}

/** @internal Registry of deployed addresses keyed by chain ID. */
const addresses: Record<number, ContractAddresses> = {
  11155420: {
    TAGITAgentIdentity: "0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D",
    TAGITAgentReputation: "0x57CCa1974DFE29593FBD24fdAEE1cD614Bfd6E4a",
    TAGITAgentValidation: "0x9806919185F98Bd07a64F7BC7F264e91939e86b7",
  },
};

/**
 * Look up deployed contract addresses for a given chain ID.
 *
 * @param chainId - The numeric EVM chain ID (e.g. 11155420 for OP Sepolia).
 * @returns The {@link ContractAddresses} for the chain.
 * @throws {Error} If no addresses are registered for the given chain.
 */
export function getAddresses(chainId: number): ContractAddresses {
  const addrs = addresses[chainId];
  if (!addrs) {
    throw new Error(`No contract addresses for chain ${chainId}`);
  }
  return addrs;
}
