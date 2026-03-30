import type { Address, PublicClient, WalletClient } from "viem";
import { createBridgeReader, createBridgeWriter } from "../contracts/bridge.js";
import { watchCrossChainSent, watchCrossChainReceived } from "../events/bridge-events.js";
import type {
  BridgeReadMethods,
  BridgeWriteMethods,
  BridgeEventMethods,
  BridgeParams,
} from "../types/bridge.js";

export interface BridgeClientConfig {
  publicClient: PublicClient;
  walletClient?: WalletClient;
  bridgeAdapterAddress: Address;
}

export interface TagitBridgeClient {
  /** Read-only bridge adapter methods */
  read: BridgeReadMethods;
  /** State-changing bridge methods (undefined if no wallet) */
  write?: BridgeWriteMethods;
  /** Event watcher methods */
  events: BridgeEventMethods;
  /**
   * Convenience: estimate fee then send in one call.
   * Requires wallet client.
   */
  bridgeTokens?(params: BridgeParams): Promise<`0x${string}`>;
}

/**
 * Create a CCIP bridge client for cross-chain wTAG transfers.
 *
 * The client bundles read-only queries, write transactions, and event watchers.
 * When no `walletClient` is provided, write methods and `bridgeTokens` are `undefined`.
 * The convenience `bridgeTokens` method estimates the CCIP fee (with a 10 % buffer)
 * and sends the cross-chain transfer in a single call.
 *
 * @param config - Bridge client configuration (public client, optional wallet, adapter address).
 * @returns A {@link TagitBridgeClient} with `read`, optional `write`/`bridgeTokens`, and `events`.
 *
 * @example
 * ```ts
 * const bridge = createBridgeClient({
 *   publicClient,
 *   walletClient,
 *   bridgeAdapterAddress: "0x...",
 * });
 *
 * // Estimate fee
 * const fee = await bridge.read.estimateFee(destSelector, recipient, amount);
 *
 * // Send cross-chain
 * const txHash = await bridge.bridgeTokens!({ destChainSelector, recipient, amount });
 * ```
 */
export function createBridgeClient(config: BridgeClientConfig): TagitBridgeClient {
  const { publicClient, walletClient, bridgeAdapterAddress } = config;

  const read = createBridgeReader(publicClient, bridgeAdapterAddress);

  const write = walletClient
    ? createBridgeWriter(walletClient, publicClient, bridgeAdapterAddress)
    : undefined;

  const events: BridgeEventMethods = {
    watchCrossChainSent: (onLogs) =>
      watchCrossChainSent(publicClient, bridgeAdapterAddress, onLogs),
    watchCrossChainReceived: (onLogs) =>
      watchCrossChainReceived(publicClient, bridgeAdapterAddress, onLogs),
  };

  const bridgeTokens = write
    ? async (params: BridgeParams): Promise<`0x${string}`> => {
        const fee = await read.estimateFee(
          params.destChainSelector,
          params.recipient,
          params.amount,
        );
        // Add 10% buffer for fee fluctuation
        const feeWithBuffer = fee + (fee / 10n);
        return write.sendCrossChain(params, feeWithBuffer);
      }
    : undefined;

  return { read, write, events, bridgeTokens };
}
