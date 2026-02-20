import { Command } from "commander";
import { infoCommand } from "./info.js";
import { registerCommand } from "./register.js";
import { feedbackCommand } from "./feedback.js";
import { validateCommand } from "./validate.js";

export const agentCommand = new Command("agent")
  .description("Manage TAGIT agents")
  .addCommand(infoCommand)
  .addCommand(registerCommand)
  .addCommand(feedbackCommand)
  .addCommand(validateCommand);
