import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { opSepolia } from "../chains/index.js";
import { getAddresses } from "../addresses/index.js";
import { createIdentityReader, createIdentityWriter } from "../contracts/identity.js";
import { createReputationReader, createReputationWriter } from "../contracts/reputation.js";
import { createValidationReader, createValidationWriter } from "../contracts/validation.js";
import { createStakingReader, createStakingWriter } from "../contracts/staking.js";
import { watchAgentRegistered, watchAgentStatusChanged } from "../events/identity-events.js";
import { watchFeedbackGiven, watchFeedbackRevoked } from "../events/reputation-events.js";
import { watchValidationRequested, watchValidationFinalized } from "../events/validation-events.js";
import { watchStakeDeposited, watchStakeWithdrawn, watchStakeSlashed } from "../events/staking-events.js";
import type { AgentClientConfig, TagitAgentClient } from "../types/client.js";
import { SdkError } from "../errors/index.js";

/**
 * Create a fully-configured TAGIT agent client with identity, reputation,
 * and validation contract access plus real-time event watchers.
 *
 * When called without a `walletClient` or `privateKey`, write methods are
 * omitted and the client operates in read-only mode.
 *
 * @param config - Client configuration (chain, RPC URL, keys, pre-built viem clients).
 *   Defaults to OP Sepolia with the chain's default public RPC.
 * @returns A {@link TagitAgentClient} with identity, reputation, validation, and events namespaces.
 * @throws {SdkError} If no RPC URL can be resolved from the config or chain definition.
 *
 * @example
 * ```ts
 * import { createAgentClient } from "@tagit/sdk";
 *
 * // Read-only (no private key)
 * const client = createAgentClient();
 * const agent = await client.identity.getAgent(1n);
 *
 * // Read-write (with private key)
 * const rw = createAgentClient({ privateKey: "0x..." });
 * const txHash = await rw.identity.register!("0x...", "https://meta.json");
 * ```
 */
export function createAgentClient(config: AgentClientConfig = {}): TagitAgentClient {
  const chain = config.chain ?? opSepolia;
  const rpcUrl = config.rpcUrl ?? chain.rpcUrls.default.http[0];

  if (!rpcUrl) {
    throw new SdkError("No RPC URL provided and chain has no default");
  }

  const publicClient: PublicClient =
    config.publicClient ??
    createPublicClient({
      chain,
      transport: http(rpcUrl),
    });

  let walletClient: WalletClient | undefined = config.walletClient;

  if (!walletClient && config.privateKey) {
    const account = privateKeyToAccount(config.privateKey);
    walletClient = createWalletClient({
      chain,
      transport: http(rpcUrl),
      account,
    });
  }

  const addresses = getAddresses(chain.id);

  const identityRead = createIdentityReader(publicClient, addresses.TAGITAgentIdentity);
  const reputationRead = createReputationReader(publicClient, addresses.TAGITAgentReputation);
  const validationRead = createValidationReader(publicClient, addresses.TAGITAgentValidation);
  const stakingRead = createStakingReader(publicClient, addresses.ReputationStaking);

  const identityWrite = walletClient
    ? createIdentityWriter(walletClient, publicClient, addresses.TAGITAgentIdentity)
    : {};

  const reputationWrite = walletClient
    ? createReputationWriter(walletClient, publicClient, addresses.TAGITAgentReputation)
    : {};

  const validationWrite = walletClient
    ? createValidationWriter(walletClient, publicClient, addresses.TAGITAgentValidation)
    : {};

  const stakingWrite = walletClient
    ? createStakingWriter(walletClient, publicClient, addresses.ReputationStaking)
    : {};

  return {
    identity: { ...identityRead, ...identityWrite },
    reputation: { ...reputationRead, ...reputationWrite },
    validation: { ...validationRead, ...validationWrite },
    staking: { ...stakingRead, ...stakingWrite },
    events: {
      watchAgentRegistered: (onLogs) =>
        watchAgentRegistered(publicClient, addresses.TAGITAgentIdentity, onLogs),
      watchAgentStatusChanged: (onLogs) =>
        watchAgentStatusChanged(publicClient, addresses.TAGITAgentIdentity, onLogs),
      watchFeedbackGiven: (onLogs) =>
        watchFeedbackGiven(publicClient, addresses.TAGITAgentReputation, onLogs),
      watchFeedbackRevoked: (onLogs) =>
        watchFeedbackRevoked(publicClient, addresses.TAGITAgentReputation, onLogs),
      watchValidationRequested: (onLogs) =>
        watchValidationRequested(publicClient, addresses.TAGITAgentValidation, onLogs),
      watchValidationFinalized: (onLogs) =>
        watchValidationFinalized(publicClient, addresses.TAGITAgentValidation, onLogs),
      watchStakeDeposited: (onLogs) =>
        watchStakeDeposited(publicClient, addresses.ReputationStaking, onLogs),
      watchStakeWithdrawn: (onLogs) =>
        watchStakeWithdrawn(publicClient, addresses.ReputationStaking, onLogs),
      watchStakeSlashed: (onLogs) =>
        watchStakeSlashed(publicClient, addresses.ReputationStaking, onLogs),
    },
    publicClient,
    walletClient,
  };
}
