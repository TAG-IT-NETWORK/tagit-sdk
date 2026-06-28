import { describe, it, expect } from "vitest";
import { createAgentClient } from "../../../src/client/create-agent-client.js";
import { baseSepolia } from "../../../src/chains/index.js";

describe("createAgentClient", () => {
  it("creates read-only client with default chain", () => {
    const client = createAgentClient();

    expect(client.publicClient).toBeDefined();
    expect(client.walletClient).toBeUndefined();
    expect(client.identity).toBeDefined();
    expect(client.reputation).toBeDefined();
    expect(client.validation).toBeDefined();
    expect(client.events).toBeDefined();
  });

  it("creates read-only client with explicit chain", () => {
    const client = createAgentClient({ chain: baseSepolia });
    expect(client.publicClient).toBeDefined();
  });

  it("creates read-only client with custom RPC URL", () => {
    const client = createAgentClient({ rpcUrl: "https://custom-rpc.example.com" });
    expect(client.publicClient).toBeDefined();
  });

  it("creates read-write client with privateKey", () => {
    const client = createAgentClient({
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    });
    expect(client.walletClient).toBeDefined();
  });

  it("identity read methods are always available", () => {
    const client = createAgentClient();
    expect(typeof client.identity.getAgent).toBe("function");
    expect(typeof client.identity.totalAgents).toBe("function");
    expect(typeof client.identity.isActiveAgent).toBe("function");
  });

  it("reputation read methods are always available", () => {
    const client = createAgentClient();
    expect(typeof client.reputation.getSummary).toBe("function");
    expect(typeof client.reputation.getFeedback).toBe("function");
  });

  it("validation read methods are always available", () => {
    const client = createAgentClient();
    expect(typeof client.validation.getSummary).toBe("function");
    expect(typeof client.validation.getValidationStatus).toBe("function");
  });

  it("event methods are always available", () => {
    const client = createAgentClient();
    expect(typeof client.events.watchAgentRegistered).toBe("function");
    expect(typeof client.events.watchFeedbackGiven).toBe("function");
    expect(typeof client.events.watchValidationFinalized).toBe("function");
  });

  it("write methods available when privateKey provided", () => {
    const client = createAgentClient({
      privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
    });
    expect(typeof client.identity.register).toBe("function");
    expect(typeof client.reputation.giveFeedback).toBe("function");
    expect(typeof client.validation.validationRequest).toBe("function");
  });

  it("write methods absent when no privateKey", () => {
    const client = createAgentClient();
    expect(client.identity.register).toBeUndefined();
    expect(client.reputation.giveFeedback).toBeUndefined();
    expect(client.validation.validationRequest).toBeUndefined();
  });
});
