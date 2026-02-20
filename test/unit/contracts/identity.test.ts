import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createIdentityReader, createIdentityWriter } from "../../../src/contracts/identity.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_WALLET,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D" as Address;

describe("Identity Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("getAgent returns structured agent data", async () => {
    const mockResult = [MOCK_ADDRESS, MOCK_WALLET, 1700000000n, true] as const;
    vi.mocked(publicClient.readContract).mockResolvedValue(mockResult);

    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    const agent = await reader.getAgent(1n);

    expect(agent).toEqual({
      registrant: MOCK_ADDRESS,
      wallet: MOCK_WALLET,
      registeredAt: 1700000000n,
      active: true,
    });
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "getAgent", args: [1n] }),
    );
  });

  it("getAgentStatus returns status number", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(1);
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentStatus(1n)).toBe(1);
  });

  it("getAgentByWallet returns agent id", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(1n);
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentByWallet(MOCK_WALLET)).toBe(1n);
  });

  it("getAgentsByRegistrant returns array of ids", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([1n, 2n]);
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentsByRegistrant(MOCK_ADDRESS)).toEqual([1n, 2n]);
  });

  it("getMetadata returns string value", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("https://example.com");
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getMetadata(1n, "url")).toBe("https://example.com");
  });

  it("isActiveAgent returns boolean", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(true);
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.isActiveAgent(1n)).toBe(true);
  });

  it("totalAgents returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(5n);
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.totalAgents()).toBe(5n);
  });

  it("registrationFee returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(0n);
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.registrationFee()).toBe(0n);
  });

  it("tokenURI returns string", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("ipfs://Qm...");
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.tokenURI(1n)).toBe("ipfs://Qm...");
  });

  it("throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("RPC error"));
    const reader = createIdentityReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getAgent(999n)).rejects.toThrow(ContractError);
  });
});

describe("Identity Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
    vi.mocked(publicClient.simulateContract).mockResolvedValue({ request: {} } as never);
    vi.mocked(walletClient.writeContract).mockResolvedValue(MOCK_TX_HASH);
  });

  it("register returns tx hash", async () => {
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.register(MOCK_WALLET, "ipfs://test");
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "register", args: [MOCK_WALLET, "ipfs://test"] }),
    );
  });

  it("setAgentURI returns tx hash", async () => {
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.setAgentURI(1n, "ipfs://new")).toBe(MOCK_TX_HASH);
  });

  it("setMetadata returns tx hash", async () => {
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.setMetadata(1n, "key", "value")).toBe(MOCK_TX_HASH);
  });

  it("suspendAgent returns tx hash", async () => {
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.suspendAgent(1n)).toBe(MOCK_TX_HASH);
  });

  it("reactivateAgent returns tx hash", async () => {
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.reactivateAgent(1n)).toBe(MOCK_TX_HASH);
  });

  it("decommissionAgent returns tx hash", async () => {
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.decommissionAgent(1n)).toBe(MOCK_TX_HASH);
  });

  it("throws ContractError on simulation failure", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("revert"));
    const writer = createIdentityWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.register(MOCK_WALLET, "test")).rejects.toThrow(ContractError);
  });
});
