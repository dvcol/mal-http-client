import { ApiError, InvalidCsrfError, InvalidParameterError, PollingExpiredError } from '@dvcol/base-http-client/utils/error';

import type { MalApiResponse } from '~/models/mal-client.model';

export const MalErrorTypes = {
  MalApiError: 'MalApiError',
  MalInvalidParameterError: 'MalInvalidParameterError',
  MalPollingExpiredError: 'MalPollingExpiredError',
  MalExpiredTokenError: 'MalExpiredTokenError',
  MalRateLimitError: 'MalRateLimitError',
  MalInvalidCsrfError: 'MalInvalidCsrfError',
} as const;

export class MalApiError<T = unknown> extends ApiError<MalApiResponse<T>> {
  constructor(message: string, error?: Error | MalApiResponse<T>) {
    super(message, error);
    this.name = MalErrorTypes.MalApiError;
  }
}

export class MalInvalidParameterError extends InvalidParameterError {
  constructor(message?: string) {
    super(message);
    this.name = MalErrorTypes.MalInvalidParameterError;
  }
}

export class MalPollingExpiredError extends PollingExpiredError {
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

export class MalInvalidCsrfError extends InvalidCsrfError {
  constructor({ state, expected }: { state?: string; expected?: string } = {}) {
    super({ state, expected });
    this.name = MalErrorTypes.MalInvalidCsrfError;
  }
}
