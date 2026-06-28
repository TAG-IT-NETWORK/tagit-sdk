import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "../../chains/index.js";

export interface CliConfig {
  rpcUrl: string;
  privateKey?: `0x${string}`;
}

export function resolveConfig(opts: { rpcUrl?: string; privateKey?: string }): CliConfig {
  const rpcUrl = opts.rpcUrl ?? process.env["TAGIT_RPC_URL"] ?? "https://sepolia.base.org";
  const privateKey = opts.privateKey ?? process.env["TAGIT_PRIVATE_KEY"];

  return {
    rpcUrl,
    privateKey: privateKey as `0x${string}` | undefined,
  };
}

export function createCliPublicClient(config: CliConfig): PublicClient {
  return createPublicClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
  });
}

export function createCliWalletClient(config: CliConfig): WalletClient {
  if (!config.privateKey) {
    throw new Error("Private key required. Use --private-key flag or TAGIT_PRIVATE_KEY env var.");
  }
  const account = privateKeyToAccount(config.privateKey);
  return createWalletClient({
    chain: baseSepolia,
    transport: http(config.rpcUrl),
    account,
  });
}
