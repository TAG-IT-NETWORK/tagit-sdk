import { SdkError } from "../errors/index.js";

export class A2AError extends SdkError {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "A2AError";
  }
}

export class A2ATimeoutError extends A2AError {
  constructor(
    public readonly url: string,
    public readonly timeoutMs: number,
    options?: ErrorOptions,
  ) {
    super(`Request to ${url} timed out after ${timeoutMs}ms`, options);
    this.name = "A2ATimeoutError";
  }
}

export class A2AConnectionError extends A2AError {
  constructor(
    public readonly url: string,
    options?: ErrorOptions,
  ) {
    super(`Failed to connect to ${url}`, options);
    this.name = "A2AConnectionError";
  }
}

export class A2AProtocolError extends A2AError {
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
