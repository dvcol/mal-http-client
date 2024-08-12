import { describe, expect, it } from 'vitest';

import { MalApiValidators } from './mal-api.validators';

describe('mal-api.validators.ts', () => {
  it('isNumber', () => {
    expect.assertions(4);

    expect(MalApiValidators.isNumber(12)).toBeTruthy();
    expect(MalApiValidators.isNumber('12')).toBeTruthy();
    expect(() => MalApiValidators.isNumber('not a number')).toThrow("Expected a valid number, but received 'not a number'.");
    expect(() => MalApiValidators.isNumber('not a number', 'field')).toThrow("Expected a valid number for 'field', but received 'not a number'.");
  });

  it('max', () => {
    expect.assertions(4);

    expect(MalApiValidators.max(12, { max: 12 })).toBeTruthy();
    expect(() => MalApiValidators.max(13, { max: 12 })).toThrow("Expected a number more than or equal to '12', but received '13'.");
    expect(MalApiValidators.max(12, { max: 12, name: 'field' })).toBeTruthy();
    expect(() => MalApiValidators.max(13, { max: 12, name: 'field' })).toThrow(
      "Expected a number more than or equal to '12' for 'field', but received '13'.",
    );
  });

  it('min', () => {
    expect.assertions(4);

    expect(MalApiValidators.min(12, { min: 12 })).toBeTruthy();
    expect(() => MalApiValidators.min(11, { min: 12 })).toThrow("Expected a number less than or equal to '12', but received '11'.");
    expect(MalApiValidators.min(12, { min: 12, name: 'field' })).toBeTruthy();
    expect(() => MalApiValidators.min(11, { min: 12, name: 'field' })).toThrow(
      "Expected a number less than or equal to '12' for 'field', but received '11'.",
    );
  });

  describe('minMax', () => {
    it('should validate without error', () => {
      expect.assertions(2);

      expect(MalApiValidators.minMax(12, { min: 12, max: 12 })).toBeTruthy();
      expect(MalApiValidators.minMax(12, { min: 10, max: 14, name: 'field' })).toBeTruthy();
    });

    it('should throw a validation error', () => {
      expect.assertions(4);

      expect(() => MalApiValidators.minMax(11, { min: 12, max: 12 })).toThrow("Expected a number between '12' and '12', but received '11'.");
      expect(() => MalApiValidators.minMax(13, { min: 12, max: 12, name: 'field' })).toThrow(
        "Expected a number between '12' and '12' for 'field', but received '13'.",
      );
      expect(() => MalApiValidators.minMax(9, { min: 10, max: 12 })).toThrow("Expected a number between '10' and '12', but received '9'.");
      expect(() => MalApiValidators.minMax(13, { min: 10, max: 12, name: 'field' })).toThrow(
        "Expected a number between '10' and '12' for 'field', but received '13'.",
      );
    });
  });
});
