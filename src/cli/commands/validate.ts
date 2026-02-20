import { Command } from "commander";
import { getAddresses } from "../../addresses/index.js";
import { createValidationWriter } from "../../contracts/validation.js";
import { resolveConfig, createCliPublicClient, createCliWalletClient } from "../utils/config.js";

export const validateCommand = new Command("validate")
  .description("Request validation for an agent")
  .requiredOption("--agent-id <id>", "Agent ID")
  .option("--defense", "Request defense-level validation (quorum 5)")
  .option("--rpc-url <url>", "RPC URL")
  .option("--private-key <key>", "Private key for signing")
  .action(async (opts: { agentId: string; defense?: boolean; rpcUrl?: string; privateKey?: string }) => {
    const config = resolveConfig(opts);
    const publicClient = createCliPublicClient(config);
    const walletClient = createCliWalletClient(config);
    const addresses = getAddresses(11155420);

    const writer = createValidationWriter(walletClient, publicClient, addresses.TAGITAgentValidation);

    const agentId = BigInt(opts.agentId);
    const isDefense = opts.defense ?? false;

    console.log(`Requesting ${isDefense ? "defense" : "standard"} validation for agent ${agentId}...`);

    const hash = await writer.validationRequest(agentId, isDefense);
    console.log(`Transaction submitted: ${hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Validation requested in block ${receipt.blockNumber}`);
  });
