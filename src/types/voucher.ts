import type { Address } from "viem";

/** Voucher contract configuration data. */
export interface VoucherData {
  /** TAGITCore contract address that can issue/burn vouchers. */
  core: Address;
  /** wTAG contract address used for redemption payouts. */
  wtag: Address;
  /** Redemption rate in basis points (10000 = 1:1). */
  redemptionRate: bigint;
  /** Whether voucher redemption is currently paused. */
  isRedemptionPaused: boolean;
  /** Contract owner address. */
  owner: Address;
}

/** Read-only methods for the Voucher contract. */
export interface VoucherReadMethods {
  /** Get the ERC-20 token name. */
  name(): Promise<string>;
  /** Get the ERC-20 token symbol. */
  symbol(): Promise<string>;
  /** Get the number of decimals. */
  decimals(): Promise<number>;
  /** Get total supply of voucher tokens. */
  totalSupply(): Promise<bigint>;
  /** Get voucher balance for an account. */
  balanceOf(account: Address): Promise<bigint>;
  /** Get the TAGITCore contract address. */
  core(): Promise<Address>;
  /** Get the wTAG contract address. */
  wtag(): Promise<Address>;
  /** Get the current redemption rate in basis points. */
  redemptionRate(): Promise<bigint>;
  /** Check if redemption is paused. */
  isRedemptionPaused(): Promise<boolean>;
  /** Get the contract version string. */
  version(): Promise<string>;
  /** Get the contract owner address. */
  owner(): Promise<Address>;
  /** Get the BASIS_POINTS constant (10000). */
  basisPoints(): Promise<bigint>;
}

/** Write methods for the Voucher contract. */
export interface VoucherWriteMethods {
  /** Issue vouchers to an account (onlyCore). */
  issue(to: Address, amount: bigint, tokenId: bigint, reason: string): Promise<`0x${string}`>;
  /** Burn vouchers from an account (onlyCore). */
  burnFrom(from: Address, amount: bigint): Promise<`0x${string}`>;
  /** Redeem vouchers for wTAG tokens at the current redemption rate. */
  redeem(amount: bigint): Promise<`0x${string}`>;
  /** Update the redemption rate (onlyOwner). */
  setRedemptionRate(newRate: bigint): Promise<`0x${string}`>;
  /** Pause or unpause redemption (onlyOwner). */
  setRedemptionPaused(paused: boolean): Promise<`0x${string}`>;
}

/** Voucher event types emitted by the contract. */
export interface VoucherEvents {
  VoucherIssued: { to: Address; amount: bigint; tokenId: bigint; reason: string };
  VoucherRedeemed: { account: Address; voucherAmount: bigint; wtagAmount: bigint };
  VoucherBurned: { from: Address; amount: bigint };
  CoreUpdated: { previousCore: Address; newCore: Address };
  WtagUpdated: { previousWtag: Address; newWtag: Address };
  RedemptionRateUpdated: { oldRate: bigint; newRate: bigint };
  RedemptionPauseToggled: { paused: boolean };
}
