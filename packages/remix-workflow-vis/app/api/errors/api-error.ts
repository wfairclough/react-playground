export interface ApiErrorCause {
  response?: Response;
  body?: string;
}

export interface ApiErrorOptions extends ErrorOptions {
  cause?: ApiErrorCause;
}

export class ApiError extends Error {
  public cause?: ApiErrorCause;
  constructor(message: string, options?: ApiErrorOptions) {
    super(message, options);
    this.name = 'ApiError';
    this.cause = options?.cause;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
