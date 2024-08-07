export const MalErrorTypes = {
  MalValidationError: 'MalValidationError',
  MalFilterError: 'MalFilterError',
  MalInvalidParameterError: 'MalInvalidParameterError',
  MalPollingExpiredError: 'MalPollingExpiredError',
  MalExpiredTokenError: 'MalExpiredTokenError',
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
  constructor(message?: string) {
    super(message);
    this.name = MalErrorTypes.MalExpiredTokenError;
  }
}
