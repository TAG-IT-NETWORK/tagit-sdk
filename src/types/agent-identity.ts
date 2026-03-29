import type { Address } from "viem";

/**
 * Unified Agent info returned by the AgentClient convenience wrapper.
 * Combines on-chain agent data with computed fields.
 */
export interface AgentInfo {
  /** On-chain agent ID (soulbound ERC-721 token ID). */
  agentId: bigint;
  /** Human operator who registered the agent. */
  registrant: Address;
  /** Agent's operational wallet address. */
  wallet: Address;
  /** Unix timestamp of registration. */
  registeredAt: bigint;
  /** Whether the agent is currently active. */
  active: boolean;
}

/** Read-only methods for the unified AgentClient. */
export interface AgentReadMethods {
  /** Get agent info by ID. */
  getAgent(agentId: bigint): Promise<AgentInfo>;
  /** Check whether an agent ID is registered and active. */
  isRegistered(agentId: bigint): Promise<boolean>;
  /** Look up an agent ID by its operational wallet address. */
  agentOf(wallet: Address): Promise<bigint>;
  /** Get all agent IDs registered by a given registrant. */
  getAllAgents(registrant: Address): Promise<readonly bigint[]>;
  /** Get the current agent status enum value. */
  getAgentStatus(agentId: bigint): Promise<number>;
  /** Get the total number of agents registered. */
  totalAgents(): Promise<bigint>;
  /** Get the agent's metadata URI. */
  tokenURI(agentId: bigint): Promise<string>;
}

/** Write methods for the unified AgentClient. */
export interface AgentWriteMethods {
  /** Register a new agent with a wallet address and metadata URI. */
  register(wallet: Address, uri: string, value?: bigint): Promise<`0x${string}`>;
  /** Update an agent's metadata URI. */
  update(agentId: bigint, uri: string): Promise<`0x${string}`>;
  /** Decommission an agent (permanent deactivation). */
  deregister(agentId: bigint): Promise<`0x${string}`>;
}
