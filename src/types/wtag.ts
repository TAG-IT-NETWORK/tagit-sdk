import type { Address } from "viem";

/** Read-only methods for the wTAG governance token contract. */
export interface WTagReadMethods {
  /** Get the ERC-20 token name. */
  name(): Promise<string>;
  /** Get the ERC-20 token symbol. */
  symbol(): Promise<string>;
  /** Get the number of decimals (typically 18). */
  decimals(): Promise<number>;
  /** Get total supply of wTAG tokens. */
  totalSupply(): Promise<bigint>;
  /** Get wTAG balance for an account. */
  balanceOf(account: Address): Promise<bigint>;
  /** Get the allowance granted by owner to spender. */
  allowance(owner: Address, spender: Address): Promise<bigint>;
  /** Get the address of the underlying TAGIT token. */
  underlyingToken(): Promise<Address>;
  /** Check whether an address is an authorized minter. */
  isMinter(account: Address): Promise<boolean>;
  /** Get the contract version string. */
  version(): Promise<string>;
  /** Get the delegate for an account (ERC20Votes). */
  delegates(account: Address): Promise<Address>;
  /** Get the current voting power for an account. */
  getVotes(account: Address): Promise<bigint>;
}

/** Write methods for the wTAG governance token contract. */
export interface WTagWriteMethods {
  /** Wrap TAGIT tokens into wTAG (1:1). Caller must have approved wTAG contract. */
  wrap(amount: bigint): Promise<`0x${string}`>;
  /** Unwrap wTAG back to TAGIT tokens (1:1). */
  unwrap(amount: bigint): Promise<`0x${string}`>;
  /** Transfer wTAG tokens to a recipient. */
  transfer(to: Address, amount: bigint): Promise<`0x${string}`>;
  /** Approve a spender to transfer wTAG tokens on behalf of caller. */
  approve(spender: Address, amount: bigint): Promise<`0x${string}`>;
  /** Transfer wTAG tokens from one address to another (requires allowance). */
  transferFrom(from: Address, to: Address, amount: bigint): Promise<`0x${string}`>;
  /** Delegate voting power to a delegatee address. */
  delegate(delegatee: Address): Promise<`0x${string}`>;
}

/** wTAG event types emitted by the contract. */
export interface WTagEvents {
  Wrapped: { account: Address; amount: bigint };
  Unwrapped: { account: Address; amount: bigint };
  MinterMinted: { to: Address; amount: bigint; minter: Address };
  MinterGranted: { minter: Address; grantedBy: Address };
  MinterRevoked: { minter: Address; revokedBy: Address };
  Transfer: { from: Address; to: Address; value: bigint };
  Approval: { owner: Address; spender: Address; value: bigint };
}
