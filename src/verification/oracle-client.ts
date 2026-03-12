import type { OracleResponse, ChainName } from "./types.js";

export interface OracleClientConfig {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
}

export function createOracleClient(config: OracleClientConfig) {
  const fetchFn = config.fetch ?? globalThis.fetch;

  return {
    async verify(assetId: string, chain: ChainName): Promise<OracleResponse> {
      const res = await fetchFn(`${config.baseUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId, chain }),
      });

      if (!res.ok) {
        throw new Error(`Oracle verification failed: ${res.status}`);
      }

      return res.json() as Promise<OracleResponse>;
    },
  };
}
