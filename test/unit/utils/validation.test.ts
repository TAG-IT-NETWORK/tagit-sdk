import { describe, it, expect } from "vitest";
import {
  addressSchema,
  agentIdSchema,
  ratingSchema,
  scoreSchema,
  uriSchema,
  commentSchema,
  justificationSchema,
} from "../../../src/utils/validation.js";

describe("Validation Schemas", () => {
  describe("addressSchema", () => {
    it("accepts valid Ethereum address", () => {
      const result = addressSchema.safeParse("0x1234567890123456789012345678901234567890");
      expect(result.success).toBe(true);
    });

    it("rejects short address", () => {
      const result = addressSchema.safeParse("0x123");
      expect(result.success).toBe(false);
    });

    it("rejects non-hex", () => {
      const result = addressSchema.safeParse("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
      expect(result.success).toBe(false);
    });

    it("rejects missing 0x prefix", () => {
      const result = addressSchema.safeParse("1234567890123456789012345678901234567890");
      expect(result.success).toBe(false);
    });
  });

  describe("agentIdSchema", () => {
    it("accepts positive bigint", () => {
      const result = agentIdSchema.safeParse(1n);
      expect(result.success).toBe(true);
    });

    it("rejects zero", () => {
      const result = agentIdSchema.safeParse(0n);
      expect(result.success).toBe(false);
    });

    it("rejects negative", () => {
      const result = agentIdSchema.safeParse(-1n);
      expect(result.success).toBe(false);
    });
  });

  describe("ratingSchema", () => {
    it("accepts 1-5", () => {
      for (let i = 1; i <= 5; i++) {
        expect(ratingSchema.safeParse(i).success).toBe(true);
      }
    });

    it("rejects 0", () => {
      expect(ratingSchema.safeParse(0).success).toBe(false);
    });

    it("rejects 6", () => {
      expect(ratingSchema.safeParse(6).success).toBe(false);
    });
  });

  describe("scoreSchema", () => {
    it("accepts 0-100", () => {
      expect(scoreSchema.safeParse(0).success).toBe(true);
      expect(scoreSchema.safeParse(100).success).toBe(true);
    });

    it("rejects 101", () => {
      expect(scoreSchema.safeParse(101).success).toBe(false);
    });

    it("rejects negative", () => {
      expect(scoreSchema.safeParse(-1).success).toBe(false);
    });
  });

  describe("uriSchema", () => {
    it("accepts non-empty string", () => {
      expect(uriSchema.safeParse("ipfs://test").success).toBe(true);
    });

    it("rejects empty string", () => {
      expect(uriSchema.safeParse("").success).toBe(false);
    });
  });

  describe("commentSchema", () => {
    it("accepts short comment", () => {
      expect(commentSchema.safeParse("Good agent").success).toBe(true);
    });

    it("rejects comment over 1024 chars", () => {
      expect(commentSchema.safeParse("x".repeat(1025)).success).toBe(false);
    });
  });

  describe("justificationSchema", () => {
    it("accepts short justification", () => {
      expect(justificationSchema.safeParse("Passed all checks").success).toBe(true);
    });

    it("rejects over 2048 chars", () => {
      expect(justificationSchema.safeParse("x".repeat(2049)).success).toBe(false);
    });
  });
});
