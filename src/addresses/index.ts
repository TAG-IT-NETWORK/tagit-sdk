import type { Address } from "viem";

export interface ContractAddresses {
  TAGITAgentIdentity: Address;
  TAGITAgentReputation: Address;
  TAGITAgentValidation: Address;
}

const addresses: Record<number, ContractAddresses> = {
  11155420: {
    TAGITAgentIdentity: "0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D",
    TAGITAgentReputation: "0x57CCa1974DFE29593FBD24fdAEE1cD614Bfd6E4a",
    TAGITAgentValidation: "0x9806919185F98Bd07a64F7BC7F264e91939e86b7",
  },
};

export function getAddresses(chainId: number): ContractAddresses {
  const addrs = addresses[chainId];
  if (!addrs) {
    throw new Error(`No contract addresses for chain ${chainId}`);
  }
  return addrs;
}
