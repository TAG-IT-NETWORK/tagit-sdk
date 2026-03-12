#!/usr/bin/env npx tsx
/**
 * TAG IT Demo Agent — Agent Physical Commerce
 *
 * An AI agent that:
 * 1. Calls the Verification Oracle to check a physical asset's on-chain state
 * 2. Reasons about the cryptographic proof using Claude Sonnet
 * 3. Conditionally executes payment only if verification passes
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... ORACLE_URL=http://localhost:3100 npx tsx examples/demo-agent.ts [tokenId]
 */

import Anthropic from "@anthropic-ai/sdk";
import { createOracleClient } from "../src/verification/oracle-client.js";
import type { OracleResponse } from "../src/verification/types.js";

// ── Config ──────────────────────────────────────────
const ORACLE_URL = process.env.ORACLE_URL ?? "http://localhost:3100";
const CHAIN = "arbitrum-sepolia" as const;
const TOKEN_ID = process.argv[2] ?? "18";

// ── Initialize ──────────────────────────────────────
const oracle = createOracleClient({ baseUrl: ORACLE_URL });
const anthropic = new Anthropic();

// ── Step 1: Call Verification Oracle ────────────────
async function verifyAsset(assetId: string): Promise<OracleResponse> {
  console.log(`\n🔍 Calling verification oracle for Token #${assetId}...`);
  console.log(`   Oracle: ${ORACLE_URL}/verify`);
  console.log(`   Chain:  ${CHAIN}\n`);

  const proof = await oracle.verify(assetId, CHAIN);

  console.log(`📋 Oracle Response (${proof.elapsedMs}ms):`);
  console.log(`   State:     ${proof.asset.lifecycleState} (code ${proof.asset.stateCode})`);
  console.log(`   Owner:     ${proof.asset.owner}`);
  console.log(`   Contract:  ${proof.asset.contractAddress}`);
  console.log(`   Signature: ${proof.proof.signature.slice(0, 20)}...`);
  console.log(`   Verified:  ${proof.verified}\n`);

  return proof;
}

// ── Step 2: Agent Reasoning ─────────────────────────
async function agentReason(proof: OracleResponse): Promise<{ shouldPay: boolean; reasoning: string }> {
  console.log("🤖 Agent reasoning about verification proof...\n");

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are an AI commerce agent evaluating a physical asset purchase.

A Verification Oracle has returned this cryptographic proof for a physical NFC-tagged product:

${JSON.stringify(proof, null, 2)}

Analyze this proof and decide whether to proceed with payment. Consider:
1. Is the asset in a valid state for purchase? (BOUND or ACTIVATED = valid)
2. Is the oracle signature present and from a known oracle?
3. Is the chain data consistent (contract address, chain ID)?
4. Any red flags?

Respond with:
- Your step-by-step reasoning
- A final verdict: PROCEED or REJECT
- One sentence explaining why`,
      },
    ],
  });

  const reasoning = message.content[0].type === "text" ? message.content[0].text : "";

  console.log("💡 Agent Reasoning:");
  console.log("─".repeat(60));
  console.log(reasoning);
  console.log("─".repeat(60));

  const shouldPay = reasoning.toUpperCase().includes("PROCEED");
  return { shouldPay, reasoning };
}

// ── Step 3: Conditional Payment ─────────────────────
async function executePayment(assetId: string, _proof: OracleResponse): Promise<void> {
  console.log("\n💰 Executing gasless payment via TAGITPaymaster...");
  console.log(`   Asset:     Token #${assetId}`);
  console.log(`   Paymaster: 0xBbB9f7dB1C38Af7998b511d8026042755Eb4F4C4`);
  console.log(`   Mode:      Gasless (ERC-4337 UserOp)`);
  console.log("   Status:    SIMULATED (testnet demo)");
  console.log("   ✅ Payment would execute. Asset transfer queued.\n");
}

// ── Main ────────────────────────────────────────────
async function main() {
  console.log("═".repeat(60));
  console.log(" TAG IT — Agent Physical Commerce Demo");
  console.log(" An AI agent verifying + purchasing a physical asset");
  console.log("═".repeat(60));

  try {
    const proof = await verifyAsset(TOKEN_ID);
    const { shouldPay } = await agentReason(proof);

    if (shouldPay && proof.verified) {
      await executePayment(TOKEN_ID, proof);
      console.log("✅ DEMO COMPLETE: Agent verified physical asset and executed payment.");
    } else {
      console.log("❌ DEMO COMPLETE: Agent rejected payment.");
      console.log(`   Reason: ${!proof.verified ? "Oracle verification failed" : "Agent reasoning rejected"}`);
    }
  } catch (err) {
    console.error("❌ Demo failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }

  console.log("\n" + "═".repeat(60));
}

main();
