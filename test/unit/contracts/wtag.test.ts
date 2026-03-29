import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createWTagReader, createWTagWriter } from "../../../src/contracts/wtag.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_WALLET,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000042" as Address;

describe("WTag Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("name returns token name", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("Wrapped TAGIT");
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.name()).toBe("Wrapped TAGIT");
  });

  it("symbol returns token symbol", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("wTAG");
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.symbol()).toBe("wTAG");
  });

  it("decimals returns number", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(18);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.decimals()).toBe(18);
  });

  it("totalSupply returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(1000000000000000000000n);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.totalSupply()).toBe(1000000000000000000000n);
  });

  it("balanceOf returns bigint for account", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(500n);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.balanceOf(MOCK_ADDRESS)).toBe(500n);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "balanceOf", args: [MOCK_ADDRESS] }),
    );
  });

  it("allowance returns bigint for owner/spender pair", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(100n);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.allowance(MOCK_ADDRESS, MOCK_WALLET)).toBe(100n);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "allowance", args: [MOCK_ADDRESS, MOCK_WALLET] }),
    );
  });

  it("underlyingToken returns address", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(MOCK_WALLET);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.underlyingToken()).toBe(MOCK_WALLET);
  });

  it("isMinter returns boolean", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(true);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.isMinter(MOCK_ADDRESS)).toBe(true);
  });

  it("version returns string", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("1.0.0");
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.version()).toBe("1.0.0");
  });

  it("delegates returns address", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(MOCK_WALLET);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.delegates(MOCK_ADDRESS)).toBe(MOCK_WALLET);
  });

  it("getVotes returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(1000n);
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getVotes(MOCK_ADDRESS)).toBe(1000n);
  });

  it("throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("RPC error"));
    const reader = createWTagReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.balanceOf(MOCK_ADDRESS)).rejects.toThrow(ContractError);
  });
});

describe("WTag Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
    vi.mocked(publicClient.simulateContract).mockResolvedValue({ request: {} } as never);
    vi.mocked(walletClient.writeContract).mockResolvedValue(MOCK_TX_HASH);
  });

  it("wrap returns tx hash", async () => {
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.wrap(1000n);
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "wrap", args: [1000n] }),
    );
  });

  it("unwrap returns tx hash", async () => {
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.unwrap(500n)).toBe(MOCK_TX_HASH);
  });

  it("transfer returns tx hash", async () => {
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.transfer(MOCK_WALLET, 100n);
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "transfer", args: [MOCK_WALLET, 100n] }),
    );
  });

  it("approve returns tx hash", async () => {
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.approve(MOCK_WALLET, 200n)).toBe(MOCK_TX_HASH);
  });

  it("transferFrom returns tx hash", async () => {
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.transferFrom(MOCK_ADDRESS, MOCK_WALLET, 50n)).toBe(MOCK_TX_HASH);
  });

  it("delegate returns tx hash", async () => {
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.delegate(MOCK_WALLET)).toBe(MOCK_TX_HASH);
  });

  it("throws ContractError on simulation failure", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("revert"));
    const writer = createWTagWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.wrap(1000n)).rejects.toThrow(ContractError);
  });
});
