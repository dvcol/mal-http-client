export const MalErrorTypes = {
  MalValidationError: 'MalValidationError',
  MalFilterError: 'MalFilterError',
  MalInvalidParameterError: 'MalInvalidParameterError',
  MalPollingExpiredError: 'MalPollingExpiredError',
  MalExpiredTokenError: 'MalExpiredTokenError',
  MalRateLimitError: 'MalRateLimitError',
  MalInvalidCsrfError: 'MalInvalidCsrfError',
};

export class MalValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = MalErrorTypes.MalValidationError;
  }
}

export class MalFilterError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = MalErrorTypes.MalFilterError;
  }
}

export class MalInvalidParameterError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = MalErrorTypes.MalInvalidParameterError;
  }
}

export class MalPollingExpiredError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = MalErrorTypes.MalPollingExpiredError;
  }
}

export class MalExpiredTokenError extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | Response;

  constructor(message?: string, error?: Error | Response) {
    super(message);
    this.name = MalErrorTypes.MalExpiredTokenError;
    this.error = error;
  }
}

export class MalRateLimitError extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | Response;

  constructor(message?: string, error?: Error | Response) {
    super(message);
    this.name = MalErrorTypes.MalRateLimitError;
    this.error = error;
  }
}

export class MalInvalidCsrfError extends Error {
  readonly state?: string;
  readonly expected?: string;
  constructor({ state, expected }: { state?: string; expected?: string } = {}) {
    super(`Invalid CSRF (State): expected '${expected}', but received ${state}`);
    this.name = MalErrorTypes.MalInvalidCsrfError;
    this.state = state;
    this.expected = expected;
  }
}
