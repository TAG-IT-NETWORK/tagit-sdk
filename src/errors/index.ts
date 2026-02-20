export class SdkError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "SdkError";
  }
}

export class ContractError extends SdkError {
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

export class ValidationError extends SdkError {
  constructor(
    message: string,
    public readonly field: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ValidationError";
  }
}
