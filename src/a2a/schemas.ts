import { z } from "zod";

export const agentCapabilitiesSchema = z.object({
  streaming: z.boolean(),
  pushNotifications: z.boolean(),
  stateTransitionHistory: z.boolean(),
});

export const agentCardSkillSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tags: z.array(z.string()),
  inputSchema: z.record(z.unknown()),
});

export const agentCardSchema = z.object({
  name: z.string(),
  description: z.string(),
  url: z.string(),
  version: z.string(),
  capabilities: agentCapabilitiesSchema,
  skills: z.array(agentCardSkillSchema),
  defaultInputModes: z.array(z.string()),
  defaultOutputModes: z.array(z.string()),
});

export const taskStatusSchema = z.enum([
  "submitted",
  "working",
  "input-required",
  "completed",
  "canceled",
  "failed",
]);

export const a2aTaskSchema = z.object({
  id: z.string(),
  status: taskStatusSchema,
  skill: z.string(),
  input: z.record(z.unknown()),
  output: z.unknown().optional(),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const jsonRpcErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.unknown().optional(),
});

export const jsonRpcResponseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.union([z.string(), z.number(), z.null()]),
  result: z.unknown().optional(),
  error: jsonRpcErrorSchema.optional(),
});
