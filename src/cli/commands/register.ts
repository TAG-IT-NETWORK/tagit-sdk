import { Command } from "commander";
import type { Address } from "viem";
import { getAddresses } from "../../addresses/index.js";
import { createIdentityReader, createIdentityWriter } from "../../contracts/identity.js";
import { resolveConfig, createCliPublicClient, createCliWalletClient } from "../utils/config.js";

export const registerCommand = new Command("register")
  .description("Register a new agent")
  .requiredOption("--wallet <address>", "Agent wallet address")
  .requiredOption("--uri <uri>", "Agent metadata URI")
  .option("--rpc-url <url>", "RPC URL")
  .option("--private-key <key>", "Private key for signing")
  .action(async (opts: { wallet: string; uri: string; rpcUrl?: string; privateKey?: string }) => {
    const config = resolveConfig(opts);
    const publicClient = createCliPublicClient(config);
    const walletClient = createCliWalletClient(config);
    const addresses = getAddresses(84532);

    const reader = createIdentityReader(publicClient, addresses.TAGITAgentIdentity);
    const writer = createIdentityWriter(walletClient, publicClient, addresses.TAGITAgentIdentity);

    const fee = await reader.registrationFee();
    console.log(`Registration fee: ${fee} wei`);

    const hash = await writer.register(opts.wallet as Address, opts.uri, fee > 0n ? fee : undefined);
    console.log(`Transaction submitted: ${hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Confirmed in block ${receipt.blockNumber}`);
  });
