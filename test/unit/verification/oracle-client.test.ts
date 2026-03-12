import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOracleClient } from "../../../src/verification/oracle-client.js";

describe("OracleClient", () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
  });

  it("calls /verify and returns typed response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        verified: true,
        asset: { tokenId: "18", lifecycleState: "BOUND", stateCode: 2, owner: "0x123", timestamp: 1710000000, contractAddress: "0xabc" },
        proof: { signature: "0xsig", messageHash: "0xhash", oracleAddress: "0xoracle", timestamp: 1710000000 },
        chain: { id: 421614, name: "arbitrum-sepolia" },
        elapsedMs: 150,
      }),
    });

    const client = createOracleClient({ baseUrl: "http://localhost:3100", fetch: mockFetch });
    const result = await client.verify("18", "arbitrum-sepolia");

    expect(result.verified).toBe(true);
    expect(result.asset.lifecycleState).toBe("BOUND");
    expect(mockFetch).toHaveBeenCalledWith(
      "http://localhost:3100/verify",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ assetId: "18", chain: "arbitrum-sepolia" }),
      }),
    );
  });

  it("throws on non-200 response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: "Chain read failed" }),
    });

    const client = createOracleClient({ baseUrl: "http://localhost:3100", fetch: mockFetch });
    await expect(client.verify("18", "arbitrum-sepolia")).rejects.toThrow("Oracle verification failed: 503");
  });
});
