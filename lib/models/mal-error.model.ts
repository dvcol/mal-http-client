import type { MalApiResponse } from '~/models/mal-client.model';

export const MalValidationErrorTypes = {
  MalApiError: 'MalApiError',
  MalValidationError: 'MalValidationError',
  MalNaNValidationError: 'MalNaNValidationError',
  MalMinValidationError: 'MalMinValidationError',
  MalMaxValidationError: 'MalMaxValidationError',
  MalMinMaxValidationError: 'MalMinMaxValidationError',
} as const;

export const MalErrorTypes = {
  MalInvalidParameterError: 'MalInvalidParameterError',
  MalPollingExpiredError: 'MalPollingExpiredError',
  MalExpiredTokenError: 'MalExpiredTokenError',
  MalRateLimitError: 'MalRateLimitError',
  MalInvalidCsrfError: 'MalInvalidCsrfError',
  ...MalValidationErrorTypes,
} as const;

export class MalApiError<T = unknown> extends Error {
  /**
   * Inner error that this error wraps.
   */
  readonly error?: Error | MalApiResponse<T>;

  constructor(message: string, error?: Error | MalApiResponse<T>) {
    super(message);
    this.name = MalErrorTypes.MalApiError;
    this.error = error;
  }
}

export class MalValidationError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = MalValidationErrorTypes.MalValidationError;
  }
}

export class MalNaNValidationError extends MalValidationError {
  readonly type = MalValidationErrorTypes.MalNaNValidationError;
  constructor(value: string | number, name?: string) {
    super(`Expected a valid number${name ? ` for '${name}'` : ''}, but received '${value}'.`);
  }
}

export class MalMinValidationError extends MalValidationError {
  readonly type = MalValidationErrorTypes.MalMinValidationError;
  constructor({ value, min, name }: { value: string | number; min: number; name?: string }) {
    super(`Expected a number less than or equal to '${min}'${name ? ` for '${name}'` : ''}, but received '${value}'.`);
  }
}

export class MalMaxValidationError extends MalValidationError {
  readonly type = MalValidationErrorTypes.MalMaxValidationError;
  constructor({ value, max, name }: { value: string | number; max: number; name?: string }) {
    super(`Expected a number more than or equal to '${max}'${name ? ` for '${name}'` : ''}, but received '${value}'.`);
  }
}

export class MalMinMaxValidationError extends MalValidationError {
  readonly type = MalValidationErrorTypes.MalMinMaxValidationError;
  constructor({ value, min, max, name }: { value: string | number; min: number; max: number; name?: string }) {
    super(`Expected a number between '${min}' and '${max}'${name ? ` for '${name}'` : ''}, but received '${value}'.`);
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

export class MalExpiredTokenError<T = unknown> extends MalApiError<T> {
  constructor(message?: string, error?: Error | MalApiResponse<T>) {
    super(message, error);
    this.name = MalErrorTypes.MalExpiredTokenError;
  }
}

export class MalRateLimitError<T = unknown> extends MalApiError<T> {
  constructor(message?: string, error?: Error | MalApiResponse<T>) {
    super(message, error);
    this.name = MalErrorTypes.MalRateLimitError;
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
