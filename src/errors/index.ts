/**
 * Base error class for all @tagit/sdk errors.
 *
 * Catching `SdkError` will also catch {@link ContractError},
 * {@link ValidationError}, and all A2A error subclasses.
 */
export class SdkError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "SdkError";
  }
}

/**
 * Thrown when an on-chain contract call fails (read or write).
 *
 * Includes the contract and function names for debugging.
 * The original viem error is attached via `options.cause`.
 */
export class ContractError extends SdkError {
  /**
   * @param message - Human-readable error description.
   * @param contractName - Name of the contract that failed (e.g. `"TAGITAgentIdentity"`).
   * @param functionName - Name of the contract function that failed.
   * @param options - Standard `ErrorOptions` (supports `cause`).
   */
  constructor(
    message: string,
    public readonly contractName: string,
    public readonly functionName: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ContractError";
  }
}

/**
 * Thrown when client-side input validation fails (Zod schema violations).
 *
 * The `field` property identifies which parameter was invalid.
 */
export class ValidationError extends SdkError {
  /**
   * @param message - Human-readable error description.
   * @param field - The name of the invalid field.
   * @param options - Standard `ErrorOptions`.
   */
  constructor(
    message: string,
    public readonly field: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ValidationError";
  }
}
