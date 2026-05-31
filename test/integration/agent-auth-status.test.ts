/**
 * Integration Test Suite: Agent Authorization Status Polling
 *
 * Task: 3314e3e9-a2d3-8154-bae8-dea3326edc56
 *
 * Tests the SDK's ability to:
 * 1. Read agent registration status from on-chain contracts
 * 2. Track agent status transitions (Registered → Active → Suspended → Decommissioned)
 * 3. Poll validation status until authorization resolves
 * 4. Combine identity + validation + reputation for full authorization picture
 *
 * Coverage Matrix:
 * ┌───────────────────────────────────────┬──────────┬──────────┐
 * │ Scenario                              │ Happy    │ Sad      │
 * ├───────────────────────────────────────┼──────────┼──────────┤
 * │ Read agent → active status            │ ✅       │          │
 * │ Read agent → suspended status         │          │ ✅       │
 * │ Read agent → not found                │          │ ✅       │
 * │ Poll validation → passes              │ ✅       │          │
 * │ Poll validation → fails               │          │ ✅       │
 * │ Poll validation → expires             │          │ ✅       │
 * │ Full auth check (identity+validation) │ ✅       │ ✅       │
 * │ A2A client → auth header forwarding   │ ✅       │ ✅       │
 * └───────────────────────────────────────┴──────────┴──────────┘
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Address } from "viem";
import { createIdentityReader } from "../../src/contracts/identity.js";
import { createValidationReader } from "../../src/contracts/validation.js";
import { createReputationReader } from "../../src/contracts/reputation.js";
import {
  createMockPublicClient,
  MOCK_ADDRESS,
  MOCK_WALLET,
} from "../helpers/mock-client.js";
import { A2AClient } from "../../src/a2a/client.js";
import { A2AProtocolError } from "../../src/a2a/errors.js";

const IDENTITY_ADDRESS = "0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D" as Address;
const VALIDATION_ADDRESS = "0x9806919185F98Bd07a64F7BC7F264e91939e86b7" as Address;
const REPUTATION_ADDRESS = "0x57CCa1974DFE29593FBD24fdAEE1cD614Bfd6E4a" as Address;

// ── Agent Status Constants ─────────────────────────────────
const AgentStatus = {
  Registered: 0,
  Active: 1,
  Suspended: 2,
  Decommissioned: 3,
} as const;

// ── Test: Agent Identity Authorization ─────────────────────

describe("Agent identity authorization flow", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("reads active agent and confirms authorization", async () => {
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([MOCK_ADDRESS, MOCK_WALLET, 1700000000n, true]) // getAgent
      .mockResolvedValueOnce(AgentStatus.Active)                              // getAgentStatus
      .mockResolvedValueOnce(true);                                           // isActiveAgent

    const reader = createIdentityReader(publicClient, IDENTITY_ADDRESS);

    const agent = await reader.getAgent(1n);
    expect(agent.active).toBe(true);
    expect(agent.registrant).toBe(MOCK_ADDRESS);

    const status = await reader.getAgentStatus(1n);
    expect(status).toBe(AgentStatus.Active);

    const isActive = await reader.isActiveAgent(1n);
    expect(isActive).toBe(true);
  });

  it("detects suspended agent → authorization denied", async () => {
    // First call: getAgent returns inactive
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([MOCK_ADDRESS, MOCK_WALLET, 1700000000n, false])
      .mockResolvedValueOnce(AgentStatus.Suspended)
      .mockResolvedValueOnce(false);

    const reader = createIdentityReader(publicClient, IDENTITY_ADDRESS);

    const agent = await reader.getAgent(1n);
    expect(agent.active).toBe(false);

    const status = await reader.getAgentStatus(1n);
    expect(status).toBe(AgentStatus.Suspended);

    const isActive = await reader.isActiveAgent(1n);
    expect(isActive).toBe(false);
  });

  it("detects decommissioned agent → permanently unauthorized", async () => {
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce(AgentStatus.Decommissioned)
      .mockResolvedValueOnce(false);

    const reader = createIdentityReader(publicClient, IDENTITY_ADDRESS);

    const status = await reader.getAgentStatus(1n);
    expect(status).toBe(AgentStatus.Decommissioned);

    const isActive = await reader.isActiveAgent(1n);
    expect(isActive).toBe(false);
  });

  it("handles non-existent agent gracefully", async () => {
    vi.mocked(publicClient.readContract).mockRejectedValue(
      new Error("execution reverted: AgentNotFound(999)"),
    );

    const reader = createIdentityReader(publicClient, IDENTITY_ADDRESS);
    await expect(reader.getAgent(999n)).rejects.toThrow();
  });
});

// ── Test: Validation Status Polling ────────────────────────

describe("Agent validation status polling", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("polls validation status → passes", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([true, 85n, 1708300000n]);

    const reader = createValidationReader(publicClient, VALIDATION_ADDRESS);
    const status = await reader.getValidationStatus(1n);

    expect(status.isValidated).toBe(true);
    expect(status.latestScore).toBe(85n);
    expect(status.lastValidatedAt).toBeGreaterThan(0n);
  });

  it("polls validation status → not yet validated", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([false, 0n, 0n]);

    const reader = createValidationReader(publicClient, VALIDATION_ADDRESS);
    const status = await reader.getValidationStatus(1n);

    expect(status.isValidated).toBe(false);
    expect(status.latestScore).toBe(0n);
  });

  it("simulates polling loop until validation passes", async () => {
    // Simulate 3 polls: pending → pending → passed
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([false, 0n, 0n])    // Poll 1: not validated
      .mockResolvedValueOnce([false, 0n, 0n])    // Poll 2: not validated
      .mockResolvedValueOnce([true, 90n, 1708400000n]); // Poll 3: validated!

    const reader = createValidationReader(publicClient, VALIDATION_ADDRESS);

    let authorized = false;
    let pollCount = 0;

    while (!authorized && pollCount < 5) {
      pollCount++;
      const status = await reader.getValidationStatus(1n);
      if (status.isValidated && status.latestScore >= 70n) {
        authorized = true;
      }
    }

    expect(authorized).toBe(true);
    expect(pollCount).toBe(3);
  });

  it("polling loop times out when validation never passes", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([false, 0n, 0n]);

    const reader = createValidationReader(publicClient, VALIDATION_ADDRESS);

    let authorized = false;
    let pollCount = 0;
    const maxPolls = 3;

    while (!authorized && pollCount < maxPolls) {
      pollCount++;
      const status = await reader.getValidationStatus(1n);
      if (status.isValidated) {
        authorized = true;
      }
    }

    expect(authorized).toBe(false);
    expect(pollCount).toBe(maxPolls);
  });

  it("validation with low score → authorization denied", async () => {
    vi.mocked(publicClient.readContract).mockResolvedValue([true, 30n, 1708300000n]);

    const reader = createValidationReader(publicClient, VALIDATION_ADDRESS);
    const status = await reader.getValidationStatus(1n);

    // Validated but score too low (<70 threshold)
    expect(status.isValidated).toBe(true);
    expect(status.latestScore).toBeLessThan(70n);
  });
});

// ── Test: Full Authorization Check (Identity + Validation + Reputation) ──

describe("Combined authorization check", () => {
  let publicClient: ReturnType<typeof createMockPublicClient>;

  beforeEach(() => {
    publicClient = createMockPublicClient();
  });

  it("fully authorized agent: active + validated + good reputation", async () => {
    // Mock calls in sequence: getAgent, getValidationStatus, getSummary
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([MOCK_ADDRESS, MOCK_WALLET, 1700000000n, true]) // identity: active
      .mockResolvedValueOnce([true, 85n, 1708300000n])                       // validation: passed
      .mockResolvedValueOnce({ totalFeedback: 5n, activeFeedback: 4n, averageRating: 420n, weightedScore: 400n, lastFeedbackAt: 1708200000n }); // reputation: good

    const identity = createIdentityReader(publicClient, IDENTITY_ADDRESS);
    const validation = createValidationReader(publicClient, VALIDATION_ADDRESS);
    const reputation = createReputationReader(publicClient, REPUTATION_ADDRESS);

    const agent = await identity.getAgent(1n);
    const validationStatus = await validation.getValidationStatus(1n);
    const reputationSummary = await reputation.getSummary(1n);

    // Full authorization check
    const isAuthorized =
      agent.active &&
      validationStatus.isValidated &&
      validationStatus.latestScore >= 70n &&
      reputationSummary.weightedScore >= 300n;

    expect(isAuthorized).toBe(true);
  });

  it("denied: agent active but validation failed", async () => {
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([MOCK_ADDRESS, MOCK_WALLET, 1700000000n, true]) // active
      .mockResolvedValueOnce([false, 0n, 0n]);                               // not validated

    const identity = createIdentityReader(publicClient, IDENTITY_ADDRESS);
    const validation = createValidationReader(publicClient, VALIDATION_ADDRESS);

    const agent = await identity.getAgent(1n);
    const validationStatus = await validation.getValidationStatus(1n);

    const isAuthorized = agent.active && validationStatus.isValidated;
    expect(isAuthorized).toBe(false);
  });

  it("denied: validated but agent suspended", async () => {
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([MOCK_ADDRESS, MOCK_WALLET, 1700000000n, false]) // suspended
      .mockResolvedValueOnce([true, 90n, 1708300000n]);                        // validated

    const identity = createIdentityReader(publicClient, IDENTITY_ADDRESS);
    const validation = createValidationReader(publicClient, VALIDATION_ADDRESS);

    const agent = await identity.getAgent(1n);
    const validationStatus = await validation.getValidationStatus(1n);

    const isAuthorized = agent.active && validationStatus.isValidated;
    expect(isAuthorized).toBe(false);
  });

  it("denied: agent active + validated but poor reputation", async () => {
    vi.mocked(publicClient.readContract)
      .mockResolvedValueOnce([MOCK_ADDRESS, MOCK_WALLET, 1700000000n, true]) // active
      .mockResolvedValueOnce([true, 80n, 1708300000n])                       // validated
      .mockResolvedValueOnce({ totalFeedback: 2n, activeFeedback: 1n, averageRating: 150n, weightedScore: 100n, lastFeedbackAt: 1708200000n }); // bad reputation

    const identity = createIdentityReader(publicClient, IDENTITY_ADDRESS);
    const validation = createValidationReader(publicClient, VALIDATION_ADDRESS);
    const reputation = createReputationReader(publicClient, REPUTATION_ADDRESS);

    const agent = await identity.getAgent(1n);
    const validationStatus = await validation.getValidationStatus(1n);
    const reputationSummary = await reputation.getSummary(1n);

    const isAuthorized =
      agent.active &&
      validationStatus.isValidated &&
      reputationSummary.weightedScore >= 300n;

    expect(isAuthorized).toBe(false);
  });
});

// ── Test: A2A Client Authorization Headers ─────────────────

describe("A2A client authorization header forwarding", () => {
  it("includes Bearer token in requests when authToken is set", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        jsonrpc: "2.0",
        id: 1,
        result: {
          id: "task-1",
          status: "completed",
          skill: "sage__echo",
          input: { text: "hello" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    });

    const client = new A2AClient({
      baseUrl: "http://localhost:3100",
      authToken: "my-secret-token",
      fetch: mockFetch,
      maxRetries: 0,
    });

    await client.sendTask({
      skill: "sage__echo",
      input: { text: "hello" },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer my-secret-token");
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("omits Authorization header when authToken is not set", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        jsonrpc: "2.0",
        id: 1,
        result: {
          id: "task-1",
          status: "completed",
          skill: "sage__echo",
          input: { text: "hello" },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }),
    });

    const client = new A2AClient({
      baseUrl: "http://localhost:3100",
      fetch: mockFetch,
      maxRetries: 0,
    });

    await client.sendTask({
      skill: "sage__echo",
      input: { text: "hello" },
    });

    const [, init] = mockFetch.mock.calls[0] as [string, RequestInit];
    const headers = init.headers as Record<string, string>;
    expect(headers["Authorization"]).toBeUndefined();
  });

  it("rejects with A2AProtocolError on 401 JSON-RPC error", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        jsonrpc: "2.0",
        id: 1,
        error: {
          code: -32001,
          message: "Unauthorized: Invalid API key",
        },
      }),
    });

    const client = new A2AClient({
      baseUrl: "http://localhost:3100",
      authToken: "bad-token",
      fetch: mockFetch,
      maxRetries: 0,
    });

    await expect(
      client.sendTask({
        skill: "sage__echo",
        input: { text: "hello" },
      }),
    ).rejects.toThrow(A2AProtocolError);
  });

  it("retries on connection error, not on protocol error", async () => {
    let callCount = 0;
    const mockFetch = vi.fn().mockImplementation(async () => {
      callCount++;
      if (callCount === 1) {
        throw new TypeError("Failed to fetch");
      }
      return {
        ok: true,
        headers: new Headers({ "Content-Type": "application/json" }),
        json: async () => ({
          jsonrpc: "2.0",
          id: 1,
          result: {
            id: "task-1",
            status: "completed",
            skill: "sage__echo",
            input: { text: "retry-test" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        }),
      };
    });

    const client = new A2AClient({
      baseUrl: "http://localhost:3100",
      authToken: "valid-token",
      fetch: mockFetch,
      maxRetries: 2,
      timeout: 5000,
    });

    const task = await client.sendTask({
      skill: "sage__echo",
      input: { text: "retry-test" },
    });

    expect(task.id).toBe("task-1");
    expect(callCount).toBe(2);
  });
});

// ── Test: Agent Card Discovery (Auth Endpoint) ─────────────

describe("A2A agent card discovery with authorization", () => {
  it("fetches agent card with auth token", async () => {
    const mockCard = {
      name: "TAGIT Sage",
      description: "AI agent for product verification",
      url: "http://localhost:3100",
      version: "1.0.0",
      capabilities: { streaming: true, pushNotifications: false, stateTransitionHistory: false },
      skills: [{ id: "sage__echo", name: "Echo", description: "Echo test", tags: ["test"], inputSchema: { type: "object" } }],
      defaultInputModes: ["text"],
      defaultOutputModes: ["text"],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => mockCard,
    });

    const client = new A2AClient({
      baseUrl: "http://localhost:3100",
      authToken: "my-token",
      fetch: mockFetch,
      maxRetries: 0,
    });

    const card = await client.connect();

    expect(card.name).toBe("TAGIT Sage");
    expect(card.skills).toHaveLength(1);
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/.well-known/agent.json"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer my-token",
        }),
      }),
    );
  });

  it("uses cached agent card on second connect call", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({
        name: "Sage",
        description: "Test",
        url: "http://localhost:3100",
        version: "1.0.0",
        capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
        skills: [] as unknown[],
        defaultInputModes: ["text"],
        defaultOutputModes: ["text"],
      }),
    });

    const client = new A2AClient({
      baseUrl: "http://localhost:3100",
      fetch: mockFetch,
      maxRetries: 0,
    });

    await client.connect();
    await client.connect(); // Should use cache

    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
