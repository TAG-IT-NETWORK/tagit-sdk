import { Command } from "commander";
import { getAddresses } from "../../addresses/index.js";
import { createReputationWriter } from "../../contracts/reputation.js";
import { resolveConfig, createCliPublicClient, createCliWalletClient } from "../utils/config.js";

export const feedbackCommand = new Command("feedback")
  .description("Give feedback to an agent")
  .requiredOption("--agent-id <id>", "Agent ID")
  .requiredOption("--rating <n>", "Rating (1-5)")
  .option("--comment <text>", "Feedback comment", "")
  .option("--rpc-url <url>", "RPC URL")
  .option("--private-key <key>", "Private key for signing")
  .action(async (opts: { agentId: string; rating: string; comment: string; rpcUrl?: string; privateKey?: string }) => {
    const config = resolveConfig(opts);
    const publicClient = createCliPublicClient(config);
    const walletClient = createCliWalletClient(config);
    const addresses = getAddresses(84532);

    const writer = createReputationWriter(walletClient, publicClient, addresses.TAGITAgentReputation);

    const agentId = BigInt(opts.agentId);
    const rating = parseInt(opts.rating, 10);
    if (rating < 1 || rating > 5) {
      console.error("Error: Rating must be between 1 and 5");
      process.exit(1);
    }

    const hash = await writer.giveFeedback(agentId, rating, opts.comment);
    console.log(`Transaction submitted: ${hash}`);
    console.log("Waiting for confirmation...");

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Feedback submitted in block ${receipt.blockNumber}`);
  });
