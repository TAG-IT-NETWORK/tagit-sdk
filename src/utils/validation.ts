import { z } from "zod";

export const addressSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Invalid Ethereum address")
  .transform((v) => v as `0x${string}`);

export const agentIdSchema = z.bigint().positive("Agent ID must be positive");

export const ratingSchema = z.number().int().min(1).max(5, "Rating must be 1-5");

export const scoreSchema = z.number().int().min(0).max(100, "Score must be 0-100");

export const uriSchema = z.string().min(1, "URI must not be empty");

export const commentSchema = z.string().max(1024, "Comment must be <= 1024 characters");

export const justificationSchema = z.string().max(2048, "Justification must be <= 2048 characters");

export const feedbackIdSchema = z.bigint().nonnegative("Feedback ID must be non-negative");

export const requestIdSchema = z.bigint().nonnegative("Request ID must be non-negative");
