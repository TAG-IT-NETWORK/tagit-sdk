import { describe, it, expect } from "vitest";
import { registerCommand } from "../../../src/cli/commands/register.js";

describe("CLI register command", () => {
  it("has correct name and description", () => {
    expect(registerCommand.name()).toBe("register");
    expect(registerCommand.description()).toContain("Register");
  });

  it("requires --wallet option", () => {
    const walletOpt = registerCommand.options.find((o) => o.long === "--wallet");
    expect(walletOpt).toBeDefined();
    expect(walletOpt!.required).toBe(true);
  });

  it("requires --uri option", () => {
    const uriOpt = registerCommand.options.find((o) => o.long === "--uri");
    expect(uriOpt).toBeDefined();
    expect(uriOpt!.required).toBe(true);
  });

  it("has --rpc-url option", () => {
    const opt = registerCommand.options.find((o) => o.long === "--rpc-url");
    expect(opt).toBeDefined();
  });

  it("has --private-key option", () => {
    const opt = registerCommand.options.find((o) => o.long === "--private-key");
    expect(opt).toBeDefined();
  });
});
