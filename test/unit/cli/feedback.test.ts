import { describe, it, expect } from "vitest";
import { feedbackCommand } from "../../../src/cli/commands/feedback.js";

describe("CLI feedback command", () => {
  it("has correct name and description", () => {
    expect(feedbackCommand.name()).toBe("feedback");
    expect(feedbackCommand.description()).toContain("feedback");
  });

  it("requires --agent-id option", () => {
    const opt = feedbackCommand.options.find((o) => o.long === "--agent-id");
    expect(opt).toBeDefined();
    expect(opt!.required).toBe(true);
  });

  it("requires --rating option", () => {
    const opt = feedbackCommand.options.find((o) => o.long === "--rating");
    expect(opt).toBeDefined();
    expect(opt!.required).toBe(true);
  });

  it("has optional --comment", () => {
    const opt = feedbackCommand.options.find((o) => o.long === "--comment");
    expect(opt).toBeDefined();
  });

  it("has --rpc-url and --private-key options", () => {
    expect(feedbackCommand.options.find((o) => o.long === "--rpc-url")).toBeDefined();
    expect(feedbackCommand.options.find((o) => o.long === "--private-key")).toBeDefined();
  });
});
