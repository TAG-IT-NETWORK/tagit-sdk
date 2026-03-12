export interface OracleResponse {
  verified: boolean;
  asset: {
    tokenId: string;
    lifecycleState: string;
    stateCode: number;
    owner: string;
    timestamp: number;
    contractAddress: string;
  };
  proof: {
    signature: string;
    messageHash: string;
    oracleAddress: string;
    timestamp: number;
  };
  chain: {
    id: number;
    name: string;
  };
  elapsedMs: number;
}

export type ChainName = "arbitrum-sepolia" | "op-sepolia";
