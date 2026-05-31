import { describe, it, expect, vi, beforeEach } from "vitest";
import { createIdentityWriter } from "./identity.js";
import { ContractError } from "../errors/index.js";

describe("createIdentityWriter — activate", () => {
  const address = "0x1234567890123456789012345678901234567890" as const;
  const mockAccount = { address: "0xdeadbeef00000000000000000000000000000000" as const };
  const mockTxHash = "0xabcdef" as `0x${string}`;

  let simulateContract: ReturnType<typeof vi.fn>;
  let writeContract: ReturnType<typeof vi.fn>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let publicClient: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let walletClient: any;
  let writer: ReturnType<typeof createIdentityWriter>;

  beforeEach(() => {
    simulateContract = vi.fn();
    writeContract = vi.fn();
    publicClient = { simulateContract };
    walletClient = { account: mockAccount, writeContract };
    writer = createIdentityWriter(walletClient, publicClient, address);
  });

  it("calls activateAgent on the contract and returns tx hash", async () => {
    const mockRequest = { functionName: "activateAgent" };
    simulateContract.mockResolvedValueOnce({ request: mockRequest });
    writeContract.mockResolvedValueOnce(mockTxHash);

    const result = await writer.activate(1n);

    expect(simulateContract).toHaveBeenCalledWith(
      expect.objectContaining({ functionName: "activateAgent", args: [1n] }),
    );
    expect(writeContract).toHaveBeenCalledWith(mockRequest);
    expect(result).toBe(mockTxHash);
  });

  it("wraps InsufficientCredibilityBond revert as ContractError", async () => {
    simulateContract.mockRejectedValueOnce(new Error("InsufficientCredibilityBond(1)"));

    await expect(writer.activate(1n)).rejects.toThrow(ContractError);
    await expect(writer.activate(1n)).rejects.toMatchObject({
      contractName: "TAGITAgentIdentity",
      functionName: "activateAgent",
    });
  });

  it("wraps AgentNotInactive revert as ContractError", async () => {
    simulateContract.mockRejectedValueOnce(new Error("AgentNotInactive(1)"));

    await expect(writer.activate(1n)).rejects.toThrow(ContractError);
    await expect(writer.activate(1n)).rejects.toMatchObject({
      contractName: "TAGITAgentIdentity",
      functionName: "activateAgent",
    });
  });
});
