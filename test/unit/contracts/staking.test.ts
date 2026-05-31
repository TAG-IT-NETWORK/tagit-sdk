import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createStakingReader, createStakingWriter } from "../../../src/contracts/staking.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000001" as Address;

describe("Staking Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("getAgentStake returns bigint stake amount", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(200000000000000000000n);
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentStake(1n)).toBe(200000000000000000000n);
    expect(publicClient.readContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "getStake", args: [1n] }),
    );
  });

  it("getMinBond returns bigint min bond", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(100000000000000000000n);
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getMinBond()).toBe(100000000000000000000n);
  });

  it("hasMinBond returns boolean", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(true);
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.hasMinBond(1n)).toBe(true);
  });

  it("getStaker returns address", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(MOCK_ADDRESS);
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getStaker(1n)).toBe(MOCK_ADDRESS);
  });

  it("getAgentStake throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("reverted"));
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getAgentStake(1n)).rejects.toThrow(ContractError);
  });

  it("getMinBond throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("reverted"));
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getMinBond()).rejects.toThrow(ContractError);
  });

  it("hasMinBond throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("reverted"));
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.hasMinBond(1n)).rejects.toThrow(ContractError);
  });

  it("getStaker throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("reverted"));
    const reader = createStakingReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getStaker(1n)).rejects.toThrow(ContractError);
  });
});

describe("Staking Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
  });

  it("stake simulates and writes", async () => {
    vi.mocked(publicClient.simulateContract).mockResolvedValue({
      request: {} as any,
      result: undefined as never,
    });

    const writer = createStakingWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.stake(1n, 200000000000000000000n);

    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "stake", args: [1n, 200000000000000000000n] }),
    );
  });

  it("unstake simulates and writes", async () => {
    vi.mocked(publicClient.simulateContract).mockResolvedValue({
      request: {} as any,
      result: undefined as never,
    });

    const writer = createStakingWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    const hash = await writer.unstake(1n);

    expect(hash).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "unstake", args: [1n] }),
    );
  });

  it("stake throws ContractError on revert", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("InsufficientBond"));

    const writer = createStakingWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.stake(1n, 1n)).rejects.toThrow(ContractError);
  });

  it("unstake throws ContractError on revert", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("AgentStillActive"));

    const writer = createStakingWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.unstake(1n)).rejects.toThrow(ContractError);
  });

  it("throws ContractError when wallet has no account", async () => {
    const noAccountWallet = createMockWalletClient({ account: undefined });
    const writer = createStakingWriter(noAccountWallet, publicClient, CONTRACT_ADDRESS);

    await expect(writer.stake(1n, 100n)).rejects.toThrow(ContractError);
  });
});
