import type { Address } from "viem";

/** Deployed contract addresses for a specific chain. */
export interface ContractAddresses {
  /** TAGITAgentIdentity proxy address. */
  TAGITAgentIdentity: Address;
  /** TAGITAgentReputation proxy address. */
  TAGITAgentReputation: Address;
  /** TAGITAgentValidation proxy address. */
  TAGITAgentValidation: Address;
  /** ReputationStaking (credibility bond) contract address. */
  ReputationStaking: Address;
  /** TAGITCore proxy address. */
  TAGITCore: Address;
  /** TAGITToken proxy address. */
  TAGITToken: Address;
  /** TAGITGovernor proxy address. */
  TAGITGovernor: Address;
  /** TAGITTreasury proxy address. */
  TAGITTreasury: Address;
  /** VerificationEscrow address. */
  VerificationEscrow: Address;
}

/**
 * @internal Registry of deployed addresses keyed by chain ID.
 *
 * Archived: OP Sepolia (11155420) + Arbitrum Sepolia (421614) deployments deprecated
 * 2026-06-27 (history in tagit-contracts). Base Sepolia (84532) is the canonical home.
 */
const addresses: Record<number, ContractAddresses> = {
  // Base Sepolia (canonical)
  84532: {
    TAGITAgentIdentity: "0x0611FE60f6E37230bDaf04c5F2Ac2dc9012130a9",
    TAGITAgentReputation: "0x32be6C82A57d5bCe897538d7dA4109eA0eeB0aA1",
    TAGITAgentValidation: "0x34766dBa7040C2c8817f1Ee1e448209826DD607e",
    ReputationStaking: "0x4154af74DA2B3a98096317100296966Ade15574A",
    TAGITCore: "0x3adC7eFdB58Ae85483Eff5D4966D916185F31D1d",
    TAGITToken: "0x5f98B83cD7Aef769cc51D2FB739BA49D561170DE",
    TAGITGovernor: "0xCF67Df870ECcbB7838c3Ab7876467c89d84DCe89",
    TAGITTreasury: "0xa4A3720d705334f409Dd24836Cc75D642125f759",
    VerificationEscrow: "0x4c9aACfcb64169E3BC187c227c4C0e0a5CFDA1cF",
  },
};

/**
 * Look up deployed contract addresses for a given chain ID.
 *
 * @param chainId - The numeric EVM chain ID (e.g. 84532 for Base Sepolia).
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
