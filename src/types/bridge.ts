import type { Address } from "viem";

/** Bridge operating mode — matches ICCIPBridgeAdapter.BridgeMode enum */
export enum BridgeMode {
  LOCK_UNLOCK = 0,
  BURN_MINT = 1,
}

/** Cross-chain transfer record returned by getTransfer() */
export interface TransferRecord {
  transferId: `0x${string}`;
  sourceChain: bigint;
  destChain: bigint;
  sender: Address;
  recipient: Address;
  amount: bigint;
  timestamp: bigint;
  completed: boolean;
}

/** Parameters for bridging tokens cross-chain */
export interface BridgeParams {
  destChainSelector: bigint;
  recipient: Address;
  amount: bigint;
}

/** Result of a sendCrossChain transaction */
export interface BridgeResult {
  txHash: `0x${string}`;
  transferId: `0x${string}`;
  ccipMessageId: `0x${string}`;
}

/** CrossChainSent event log */
export interface CrossChainSentLog {
  transferId: `0x${string}`;
  ccipMessageId: `0x${string}`;
  destChain: bigint;
  sender: Address;
  recipient: Address;
  amount: bigint;
  fee: bigint;
}

/** CrossChainReceived event log */
export interface CrossChainReceivedLog {
  transferId: `0x${string}`;
  ccipMessageId: `0x${string}`;
  sourceChain: bigint;
  sender: Address;
  recipient: Address;
  amount: bigint;
}

/** Read-only methods on the bridge adapter */
export interface BridgeReadMethods {
  estimateFee(destChainSelector: bigint, recipient: Address, amount: bigint): Promise<bigint>;
  getTransfer(transferId: `0x${string}`): Promise<TransferRecord>;
  isDestChainSupported(chainSelector: bigint): Promise<boolean>;
  bridgeMode(): Promise<BridgeMode>;
  wTag(): Promise<Address>;
  router(): Promise<Address>;
  isPaused(): Promise<boolean>;
  lockedBalance(): Promise<bigint>;
  version(): Promise<string>;
}

/** Write methods on the bridge adapter */
export interface BridgeWriteMethods {
  sendCrossChain(params: BridgeParams, feeValue: bigint): Promise<`0x${string}`>;
}

/** Event watcher methods */
export interface BridgeEventMethods {
  watchCrossChainSent(onLogs: (logs: readonly CrossChainSentLog[]) => void): () => void;
  watchCrossChainReceived(onLogs: (logs: readonly CrossChainReceivedLog[]) => void): () => void;
}
