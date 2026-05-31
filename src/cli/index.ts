#!/usr/bin/env node
import { Command } from "commander";
import { agentCommand } from "./commands/agent.js";

const program = new Command()
  .name("tagit")
  .description("TAGIT SDK CLI — interact with ERC-8004 agent contracts")
  .version("0.1.0")
  .addCommand(agentCommand);

program.parseAsync(process.argv).catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
