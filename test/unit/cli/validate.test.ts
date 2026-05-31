import { describe, it, expect } from "vitest";
import { validateCommand } from "../../../src/cli/commands/validate.js";

describe("CLI validate command", () => {
  it("has correct name and description", () => {
    expect(validateCommand.name()).toBe("validate");
    expect(validateCommand.description()).toContain("validation");
  });

  it("requires --agent-id option", () => {
    const opt = validateCommand.options.find((o) => o.long === "--agent-id");
    expect(opt).toBeDefined();
    expect(opt!.required).toBe(true);
  });

  it("has --defense flag", () => {
    const opt = validateCommand.options.find((o) => o.long === "--defense");
    expect(opt).toBeDefined();
  });

  it("has --rpc-url and --private-key options", () => {
    expect(validateCommand.options.find((o) => o.long === "--rpc-url")).toBeDefined();
    expect(validateCommand.options.find((o) => o.long === "--private-key")).toBeDefined();
  });
});
