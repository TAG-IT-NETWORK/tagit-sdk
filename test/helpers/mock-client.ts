import { vi } from "vitest";
import type { Address, PublicClient, WalletClient } from "viem";

export const MOCK_ADDRESS = "0x1234567890123456789012345678901234567890" as Address;
export const MOCK_WALLET = "0xaBcDef0123456789aBcDeF0123456789AbCdEf01" as Address;
export const MOCK_TX_HASH = "0x0000000000000000000000000000000000000000000000000000000000000001" as `0x${string}`;

export function createMockPublicClient(overrides: Record<string, unknown> = {}): PublicClient {
  return {
    readContract: vi.fn(),
    simulateContract: vi.fn(),
    watchContractEvent: vi.fn().mockReturnValue(vi.fn()),
    ...overrides,
  } as unknown as PublicClient;
}

export function createMockWalletClient(overrides: Record<string, unknown> = {}): WalletClient {
  return {
    account: { address: MOCK_ADDRESS, type: "local" as const },
    writeContract: vi.fn().mockResolvedValue(MOCK_TX_HASH),
    ...overrides,
  } as unknown as WalletClient;
}
