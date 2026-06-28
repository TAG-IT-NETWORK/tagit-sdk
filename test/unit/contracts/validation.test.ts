import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createValidationReader, createValidationWriter } from "../../../src/contracts/validation.js";
import {
  createMockPublicClient,
  createMockWalletClient,
  MOCK_ADDRESS,
  MOCK_TX_HASH,
} from "../../helpers/mock-client.js";
import { ContractError } from "../../../src/errors/index.js";

const CONTRACT_ADDRESS = "0x34766dBa7040C2c8817f1Ee1e448209826DD607e" as Address;

describe("Validation Reader", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("getRequest returns structured data", async () => {
    const mockRequest = {
      agentId: 1n,
      requester: MOCK_ADDRESS,
      quorum: 3,
      responseCount: 0,
      createdAt: 1700000000n,
      status: 0,
      isDefense: false,
    };
    vi.mocked(publicClient.readContract).mockResolvedValue(mockRequest);

    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    const request = await reader.getRequest(1n);
    expect(request.quorum).toBe(3);
    expect(request.isDefense).toBe(false);
  });

  it("getSummary returns validation summary", async () => {
    const mockSummary = {
      totalRequests: 5n,
      passedCount: 3n,
      failedCount: 1n,
      latestScore: 85n,
      lastValidatedAt: 1700000000n,
      isValidated: true,
    };
    vi.mocked(publicClient.readContract).mockResolvedValue(mockSummary);

    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    const summary = await reader.getSummary(1n);
    expect(summary.isValidated).toBe(true);
    expect(summary.latestScore).toBe(85n);
  });

  it("getValidationStatus returns destructured tuple", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([true, 85n, 1700000000n]);

    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    const status = await reader.getValidationStatus(1n);
    expect(status).toEqual({
      isValidated: true,
      latestScore: 85n,
      lastValidatedAt: 1700000000n,
    });
  });

  it("getResponses returns array", async () => {
    const mockResponses = [
      { validator: MOCK_ADDRESS, score: 80, justification: "Good", timestamp: 1700000000n },
    ];
    vi.mocked(publicClient.readContract).mockResolvedValue(mockResponses);

    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    const responses = await reader.getResponses(1n);
    expect(responses).toHaveLength(1);
    expect(responses[0]!.score).toBe(80);
  });

  it("getAgentRequests returns bigint array", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([1n, 2n]);
    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.getAgentRequests(1n)).toEqual([1n, 2n]);
  });

  it("getValidatorStats returns struct", async () => {
    const mockStats = { totalResponses: 10n, accurateResponses: 8n, lastResponseAt: 1700000000n };
    vi.mocked(publicClient.readContract).mockResolvedValue(mockStats);

    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    const stats = await reader.getValidatorStats(MOCK_ADDRESS);
    expect(stats.totalResponses).toBe(10n);
  });

  it("hasValidatorResponded returns boolean", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue(true);
    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    expect(await reader.hasValidatorResponded(1n, MOCK_ADDRESS)).toBe(true);
  });

  it("throws ContractError on failure", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(new Error("RPC error"));
    const reader = createValidationReader(publicClient, CONTRACT_ADDRESS);
    await expect(reader.getRequest(999n)).rejects.toThrow(ContractError);
  });
});

describe("Validation Writer", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;
  let walletClient: ReturnType<typeof createMockWalletClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
    walletClient = createMockWalletClient();
    vi.mocked(publicClient.simulateContract).mockResolvedValue({ request: {} } as never);
    vi.mocked(walletClient.writeContract).mockResolvedValue(MOCK_TX_HASH);
  });

  it("validationRequest returns tx hash", async () => {
    const writer = createValidationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.validationRequest(1n, false)).toBe(MOCK_TX_HASH);
    expect(publicClient.simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "validationRequest", args: [1n, false] }),
    );
  });

  it("validationResponse returns tx hash", async () => {
    const writer = createValidationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    expect(await writer.validationResponse(1n, 85, "Looks good")).toBe(MOCK_TX_HASH);
  });

  it("throws ContractError on simulation failure", async () => {
    vi.mocked(publicClient.simulateContract).mockRejectedValue(new Error("revert"));
    const writer = createValidationWriter(walletClient, publicClient, CONTRACT_ADDRESS);
    await expect(writer.validationRequest(1n, false)).rejects.toThrow(ContractError);
  });
});
