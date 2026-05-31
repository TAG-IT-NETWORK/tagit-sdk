import { z } from "zod";

/** Zod schema for a valid Ethereum address (`0x` + 40 hex chars). Transforms to `0x${string}`. */
export const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid Ethereum address")
  .transform((v) => v as `0x${string}`);

/** Zod schema for an agent ID (positive bigint). */
export const agentIdSchema = z.bigint().positive("Agent ID must be positive");

/** Zod schema for a feedback rating (integer 1-5). */
export const ratingSchema = z.number().int().min(1).max(5, "Rating must be 1-5");

/** Zod schema for a validation score (integer 0-100). */
export const scoreSchema = z.number().int().min(0).max(100, "Score must be 0-100");

/** Zod schema for a non-empty URI string. */
export const uriSchema = z.string().min(1, "URI must not be empty");

/** Zod schema for a feedback comment (max 1024 characters). */
export const commentSchema = z.string().max(1024, "Comment must be <= 1024 characters");

/** Zod schema for a validation justification (max 2048 characters). */
export const justificationSchema = z.string().max(2048, "Justification must be <= 2048 characters");

/** Zod schema for a feedback ID (non-negative bigint). */
export const feedbackIdSchema = z.bigint().nonnegative("Feedback ID must be non-negative");

/** Zod schema for a validation request ID (non-negative bigint). */
export const requestIdSchema = z.bigint().nonnegative("Request ID must be non-negative");
