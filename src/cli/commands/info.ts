import { Command } from "commander";
import { getAddresses } from "../../addresses/index.js";
import { createIdentityReader } from "../../contracts/identity.js";
import { createReputationReader } from "../../contracts/reputation.js";
import { createValidationReader } from "../../contracts/validation.js";
import { resolveConfig, createCliPublicClient } from "../utils/config.js";
import { formatJson, formatTable } from "../utils/output.js";

export const infoCommand = new Command("info")
  .description("Get agent info (read-only)")
  .requiredOption("--agent-id <id>", "Agent ID")
  .option("--rpc-url <url>", "RPC URL")
  .option("--json", "Output as JSON")
  .action(async (opts: { agentId: string; rpcUrl?: string; json?: boolean }) => {
    const config = resolveConfig(opts);
    const publicClient = createCliPublicClient(config);
    const addresses = getAddresses(11155420);

    const identity = createIdentityReader(publicClient, addresses.TAGITAgentIdentity);
    const reputation = createReputationReader(publicClient, addresses.TAGITAgentReputation);
    const validation = createValidationReader(publicClient, addresses.TAGITAgentValidation);

    const agentId = BigInt(opts.agentId);
    const [agent, status, repSummary, valStatus] = await Promise.all([
      identity.getAgent(agentId),
      identity.getAgentStatus(agentId),
      reputation.getSummary(agentId),
      validation.getValidationStatus(agentId),
    ]);

    const statusLabels = ["Registered", "Active", "Suspended", "Decommissioned"];

    const data = {
      agentId: agentId.toString(),
      registrant: agent.registrant,
      wallet: agent.wallet,
      status: statusLabels[status] ?? `Unknown(${status})`,
      active: agent.active,
      registeredAt: new Date(Number(agent.registeredAt) * 1000).toISOString(),
      totalFeedback: repSummary.totalFeedback.toString(),
      averageRating: repSummary.averageRating.toString(),
      weightedScore: repSummary.weightedScore.toString(),
      isValidated: valStatus.isValidated,
      latestScore: valStatus.latestScore.toString(),
    };

    if (opts.json) {
      console.log(formatJson(data));
    } else {
      console.log(formatTable([data]));
    }
  });
