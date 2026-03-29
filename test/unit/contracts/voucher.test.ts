import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createVoucherReader, createVoucherWriter } from "../../../src/contracts/voucher.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_WALLET,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000043" as Address;

describe("Voucher Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("name returns token name", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("TAGIT Voucher");
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.name()).toBe("TAGIT Voucher");
  });

  it("symbol returns token symbol", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("vTAG");
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.symbol()).toBe("vTAG");
  });

  it("decimals returns number", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(18);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.decimals()).toBe(18);
  });

  it("totalSupply returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(50000n);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.totalSupply()).toBe(50000n);
  });

  it("balanceOf returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(100n);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.balanceOf(MOCK_ADDRESS)).toBe(100n);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "balanceOf", args: [MOCK_ADDRESS] }),
    );
  });

  it("core returns address", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(MOCK_ADDRESS);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.core()).toBe(MOCK_ADDRESS);
  });

  it("wtag returns address", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(MOCK_WALLET);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.wtag()).toBe(MOCK_WALLET);
  });

  it("redemptionRate returns bigint", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(10000n);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.redemptionRate()).toBe(10000n);
  });

  it("isRedemptionPaused returns boolean", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(false);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.isRedemptionPaused()).toBe(false);
  });

  it("version returns string", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue("1.0.0");
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.version()).toBe("1.0.0");
  });

  it("owner returns address", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(MOCK_ADDRESS);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.owner()).toBe(MOCK_ADDRESS);
  });

  it("basisPoints returns bigint constant", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(10000n);
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.basisPoints()).toBe(10000n);
  });

  it("throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("RPC error"));
    const reader = createVoucherReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.balanceOf(MOCK_ADDRESS)).rejects.toThrow(ContractError);
  });
});

describe("Voucher Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
    vi.mocked(publicClient.simulateContract).mockResolvedValue({ request: {} } as never);
    vi.mocked(walletClient.writeContract).mockResolvedValue(MOCK_TX_HASH);
  });

  it("issue returns tx hash", async () => {
    const writer = createVoucherWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.issue(MOCK_WALLET, 100n, 1n, "activation reward");
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({
        functionName: "issue",
        args: [MOCK_WALLET, 100n, 1n, "activation reward"],
      }),
    );
  });

  it("burnFrom returns tx hash", async () => {
    const writer = createVoucherWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.burnFrom(MOCK_ADDRESS, 50n);
    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "burnFrom", args: [MOCK_ADDRESS, 50n] }),
    );
  });

  it("redeem returns tx hash", async () => {
    const writer = createVoucherWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.redeem(200n)).toBe(MOCK_TX_HASH);
  });

  it("setRedemptionRate returns tx hash", async () => {
    const writer = createVoucherWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.setRedemptionRate(5000n)).toBe(MOCK_TX_HASH);
  });

  it("setRedemptionPaused returns tx hash", async () => {
    const writer = createVoucherWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.setRedemptionPaused(true)).toBe(MOCK_TX_HASH);
  });

  it("throws ContractError on simulation failure", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("revert"));
    const writer = createVoucherWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.redeem(100n)).rejects.toThrow(ContractError);
  });
});
