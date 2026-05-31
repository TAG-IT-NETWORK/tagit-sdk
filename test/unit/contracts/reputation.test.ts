import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createReputationReader, createReputationWriter } from "../../../src/contracts/reputation.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0x57CCa1974DFE29593FBd24fdAEE1cD614Bfd6E4a" as Address;

describe("Reputation Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("getSummary returns structured data", async () => {
    const mockSummary = {
      totalFeedback: 10n,
      activeFeedback: 8n,
      averageRating: 4n,
      weightedScore: 85n,
      lastFeedbackAt: 1700000000n,
    };
    vi.mocked(publicClient.readContract).mockResolvedValue(mockSummary);

    const reader = createReputationReader(publicClient, CONTRACT_ADDRESS);
    const summary = await reader.getSummary(1n);
    expect(summary).toEqual(mockSummary);
  });

  it("getFeedback returns feedback struct", async () => {
    const mockFeedback = {
      reviewer: MOCK_ADDRESS,
      agentId: 1n,
      rating: 5,
      comment: "Great agent",
      response: "",
      timestamp: 1700000000n,
      revoked: false,
    };
    vi.mocked(publicClient.readContract).mockResolvedValue(mockFeedback);

    const reader = createReputationReader(publicClient, CONTRACT_ADDRESS);
    const feedback = await reader.getFeedback(1n);
    expect(feedback.rating).toBe(5);
    expect(feedback.revoked).toBe(false);
  });

  it("readAllFeedback returns array", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([]);
    const reader = createReputationReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.readAllFeedback(1n)).toEqual([]);
  });

  it("getAgentFeedbackIds returns bigint array", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([1n, 2n, 3n]);
    const reader = createReputationReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentFeedbackIds(1n)).toEqual([1n, 2n, 3n]);
  });

  it("getReviewerFeedback returns feedback id", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(42n);
    const reader = createReputationReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getReviewerFeedback(MOCK_ADDRESS, 1n)).toBe(42n);
  });

  it("throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("RPC error"));
    const reader = createReputationReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getSummary(999n)).rejects.toThrow(ContractError);
  });
});

describe("Reputation Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
    vi.mocked(publicClient.simulateContract).mockResolvedValue({ request: {} } as never);
    vi.mocked(walletClient.writeContract).mockResolvedValue(MOCK_TX_HASH);
  });

  it("giveFeedback returns tx hash", async () => {
    const writer = createReputationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.giveFeedback(1n, 5, "Great")).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "giveFeedback", args: [1n, 5, "Great"] }),
    );
  });

  it("revokeFeedback returns tx hash", async () => {
    const writer = createReputationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.revokeFeedback(1n)).toBe(MOCK_TX_HASH);
  });

  it("appendResponse returns tx hash", async () => {
    const writer = createReputationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.appendResponse(1n, "Thank you")).toBe(MOCK_TX_HASH);
  });

  it("throws ContractError on simulation failure", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("revert"));
    const writer = createReputationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.giveFeedback(1n, 5, "test")).rejects.toThrow(ContractError);
  });
});
