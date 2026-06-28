import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createAgentReader, createAgentWriter } from "../../../src/contracts/agent-client.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_WALLET,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0x0611FE60f6E37230bDaf04c5F2Ac2dc9012130a9" as Address;

describe("Agent Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("getAgent returns AgentInfo with agentId included", async () => {
    const mockResult = [MOCK_ADDRESS, MOCK_WALLET, 1700000000n, true] as const;
    vi.mocked(publicClient.readContract).mockResolvedValue(mockResult);

    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    const agent = await reader.getAgent(42n);

    expect(agent).toEqual({
      agentId: 42n,
      registrant: MOCK_ADDRESS,
      wallet: MOCK_WALLET,
      registeredAt: 1700000000n,
      active: true,
    });
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "getAgent", args: [42n] }),
    );
  });

  it("isRegistered returns boolean (maps to isActiveAgent)", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(true);
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.isRegistered(1n)).toBe(true);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "isActiveAgent", args: [1n] }),
    );
  });

  it("agentOf returns bigint (maps to getAgentByWallet)", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(5n);
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.agentOf(MOCK_WALLET)).toBe(5n);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "getAgentByWallet", args: [MOCK_WALLET] }),
    );
  });

  it("getAllAgents returns array of bigints (maps to getAgentsByRegistrant)", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([1n, 2n, 3n]);
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAllAgents(MOCK_ADDRESS)).toEqual([1n, 2n, 3n]);
  });

  it("getAgentStatus returns status number", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(1);
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentStatus(1n)).toBe(1);
  });

  it("totalAgents returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(10n);
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.totalAgents()).toBe(10n);
  });

  it("tokenURI returns string", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("ipfs://QmTest");
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.tokenURI(1n)).toBe("ipfs://QmTest");
  });

  it("throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("RPC error"));
    const reader = createAgentReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getAgent(999n)).rejects.toThrow(ContractError);
  });
});

describe("Agent Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
    vi.mocked(publicClient.simulateContract).mockResolvedValue({ request: {} } as never);
    vi.mocked(walletClient.writeContract).mockResolvedValue(MOCK_TX_HASH);
  });

  it("register returns tx hash (maps to register)", async () => {
    const writer = createAgentWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.register(MOCK_WALLET, "ipfs://agent-meta");
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "register", args: [MOCK_WALLET, "ipfs://agent-meta"] }),
    );
  });

  it("register accepts optional value for registration fee", async () => {
    const writer = createAgentWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await writer.register(MOCK_WALLET, "ipfs://test", 1000n);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ value: 1000n }),
    );
  });

  it("update returns tx hash (maps to setAgentURI)", async () => {
    const writer = createAgentWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.update(1n, "ipfs://updated-meta");
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "setAgentURI", args: [1n, "ipfs://updated-meta"] }),
    );
  });

  it("deregister returns tx hash (maps to decommissionAgent)", async () => {
    const writer = createAgentWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.deregister(1n);
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "decommissionAgent", args: [1n] }),
    );
  });

  it("throws ContractError on simulation failure", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("revert"));
    const writer = createAgentWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.register(MOCK_WALLET, "test")).rejects.toThrow(ContractError);
  });
});
