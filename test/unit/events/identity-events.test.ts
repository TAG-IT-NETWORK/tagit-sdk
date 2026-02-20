import { describe, it, expect, vi } from "vitest";
import type { Address } from "viem";
import { watchAgentRegistered, watchAgentStatusChanged } from "../../../src/events/identity-events.js";
import { createMockPublicClient } from "../../helpers/mock-client.js";

const CONTRACT_ADDRESS = "0xA7f34FD595eBc397Fe04DcE012dbcf0fbbD2A78D" as Address;

describe("Identity Events", () => {
  it("watchAgentRegistered calls watchContractEvent and returns unsubscribe", () => {
    const unsubscribe = vi.fn();
    const publicClient = createMockPublicClient({
      watchContractEvent: vi.fn().mockReturnValue(unsubscribe),
    });

    const callback = vi.fn();
    const unsub = watchAgentRegistered(publicClient, CONTRACT_ADDRESS, callback);

    expect(publicClient.watchContractEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: "AgentRegistered" }),
    );
    expect(typeof unsub).toBe("function");
  });

  it("watchAgentStatusChanged calls watchContractEvent", () => {
    const publicClient = createMockPublicClient({
      watchContractEvent: vi.fn().mockReturnValue(vi.fn()),
    });

    const callback = vi.fn();
    watchAgentStatusChanged(publicClient, CONTRACT_ADDRESS, callback);

    expect(publicClient.watchContractEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventName: "AgentStatusChanged" }),
    );
  });

  it("watchAgentRegistered maps log args correctly", () => {
    let capturedOnLogs: ((logs: unknown[]) => void) | undefined;
    const publicClient = createMockPublicClient({
      watchContractEvent: vi.fn().mockImplementation((opts: { onLogs: (logs: unknown[]) => void }) => {
        capturedOnLogs = opts.onLogs;
        return vi.fn();
      }),
    });

    const callback = vi.fn();
    watchAgentRegistered(publicClient, CONTRACT_ADDRESS, callback);

    capturedOnLogs!([{
      args: {
        agentId: 1n,
        registrant: "0x1111111111111111111111111111111111111111",
        wallet: "0x2222222222222222222222222222222222222222",
        uri: "ipfs://test",
      },
    }]);

    expect(callback).toHaveBeenCalledWith([{
      agentId: 1n,
      registrant: "0x1111111111111111111111111111111111111111",
      wallet: "0x2222222222222222222222222222222222222222",
      uri: "ipfs://test",
    }]);
  });
});
