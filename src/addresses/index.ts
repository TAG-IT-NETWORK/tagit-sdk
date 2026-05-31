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

/** @internal Registry of deployed addresses keyed by chain ID. */
const addresses: Record<number, ContractAddresses> = {
  // OP Sepolia
  11155420: {
    TAGITAgentIdentity: "0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D",
    TAGITAgentReputation: "0x57CCa1974DFE29593FBD24fdAEE1cD614Bfd6E4a",
    TAGITAgentValidation: "0x9806919185F98Bd07a64F7BC7F264e91939e86b7",
    ReputationStaking: "0x0000000000000000000000000000000000000000",
    TAGITCore: "0x8BdE22da889306d422802728cb98B6Da42ed8e1a",
    TAGITToken: "0x061a89736F91cAC11272B8A95fc7e377cD0e4067",
    TAGITGovernor: "0x8A7cd4FC493663Fc5CD0268704969D644BA773e3",
    TAGITTreasury: "0x841B07Ad929CCC589446e29Aa0C4Dd1639B48674",
    VerificationEscrow: "0x698D4DbaE56BC7e36E2Ab34bd47aB97461219726",
  },
  // Arbitrum Sepolia
  421614: {
    TAGITAgentIdentity: "0x5F5F71653d4929c6cD06EF8B16828b084BDf737c",
    TAGITAgentReputation: "0x6792EC172F57e124923FC10486cA47341F351D3c",
    TAGITAgentValidation: "0xbD7ac881567993DFBC56Bf7a7D76db083f04425c",
    ReputationStaking: "0x0000000000000000000000000000000000000000",
    TAGITCore: "0x5952f5af2429e6f973FE40aD6bEad5c770837233",
    TAGITToken: "0x42456C31b336D866DE9EB56f9916Af0A97Ae14f6",
    TAGITGovernor: "0xad0b3009b5C57D3034bB4b8eBaCb1028D6891c06",
    TAGITTreasury: "0x79af1F94Bbe40Ad8A52774fFD69626EE48701d48",
    VerificationEscrow: "0xF78C7d5bdED8eA0B159b0223a631679E91508C04",
  },
  // Base Sepolia
  84532: {
    TAGITAgentIdentity: "0x0611FE60f6E37230bDaf04c5F2Ac2dc9012130a9",
    TAGITAgentReputation: "0x32be6C82A57d5bCe897538d7dA4109eA0eeB0aA1",
    TAGITAgentValidation: "0x34766dBa7040C2c8817f1Ee1e448209826DD607e",
    ReputationStaking: "0x0000000000000000000000000000000000000000",
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
