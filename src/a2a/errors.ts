import { SdkError } from "../errors/index.js";

/**
 * Base error for all A2A protocol failures.
 * Extends {@link SdkError} so a single `catch (e instanceof SdkError)` handles both
 * contract and A2A errors.
 */
export class A2AError extends SdkError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "A2AError";
  }
}

/**
 * Thrown when an A2A HTTP request exceeds the configured timeout.
 */
export class A2ATimeoutError extends A2AError {
  /**
   * @param url - The URL that timed out.
   * @param timeoutMs - The timeout threshold in milliseconds.
   * @param options - Standard `ErrorOptions`.
   */
  constructor(
    public readonly url: string,
    public readonly timeoutMs: number,
    options?: ErrorOptions,
  ) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`, options);
    this.name = "A2ATimeoutError";
  }
}

/**
 * Thrown when the HTTP connection to an A2A agent fails (network error, non-OK status).
 */
export class A2AConnectionError extends A2AError {
  /**
   * @param url - The URL that could not be reached.
   * @param options - Standard `ErrorOptions` (may include `cause`).
   */
  constructor(
    public readonly url: string,
    options?: ErrorOptions,
  ) {
    super(`Failed to connect to ${url}`, options);
    this.name = "A2AConnectionError";
  }
}

/**
 * Thrown when the remote agent returns a JSON-RPC error response.
 */
export class A2AProtocolError extends A2AError {
  /**
   * @param code - JSON-RPC error code (e.g. -32601 for method not found).
   * @param message - Human-readable error message from the agent.
   * @param data - Optional additional error data from the agent.
   * @param options - Standard `ErrorOptions`.
   */
  constructor(
    public readonly code: number,
    message: string,
    public readonly data?: unknown,
    options?: ErrorOptions,
  ) {
    super(`A2A RPC error ${code}: ${message}`, options);
    this.name = "A2AProtocolError";
  }
}
