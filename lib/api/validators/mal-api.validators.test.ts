import { describe, expect, it } from 'vitest';

import { MalMaxValidationError, MalMinMaxValidationError, MalMinValidationError, MalNaNValidationError } from '../../models/mal-error.model';

import { MalApiValidators } from './mal-api.validators';

describe('mal-api.validators.ts', () => {
  it('isNumber', () => {
    expect.assertions(4);

    expect(MalApiValidators.isNumber(12)).toBeTruthy();
    expect(MalApiValidators.isNumber('12')).toBeTruthy();
    expect(() => MalApiValidators.isNumber('not a number')).toThrow(new MalNaNValidationError('not a number'));
    expect(() => MalApiValidators.isNumber('not a number', 'field')).toThrow(new MalNaNValidationError('not a number', 'field'));
  });

  it('max', () => {
    expect.assertions(4);

    expect(MalApiValidators.max(12, { max: 12 })).toBeTruthy();
    expect(() => MalApiValidators.max(13, { max: 12 })).toThrow(new MalMaxValidationError({ value: 13, max: 12 }));
    expect(MalApiValidators.max(12, { max: 12, name: 'field' })).toBeTruthy();
    expect(() => MalApiValidators.max(13, { max: 12, name: 'field' })).toThrow(new MalMaxValidationError({ value: 13, max: 12, name: 'field' }));
  });

  it('min', () => {
    expect.assertions(4);

    expect(MalApiValidators.min(12, { min: 12 })).toBeTruthy();
    expect(() => MalApiValidators.min(11, { min: 12 })).toThrow(new MalMinValidationError({ value: 11, min: 12 }));
    expect(MalApiValidators.min(12, { min: 12, name: 'field' })).toBeTruthy();
    expect(() => MalApiValidators.min(11, { min: 12, name: 'field' })).toThrow(new MalMinValidationError({ value: 11, min: 12, name: 'field' }));
  });

  describe('minMax', () => {
    it('should validate without error', () => {
      expect.assertions(2);

      expect(MalApiValidators.minMax(12, { min: 12, max: 12 })).toBeTruthy();
      expect(MalApiValidators.minMax(12, { min: 10, max: 14, name: 'field' })).toBeTruthy();
    });

    it('should throw a validation error', () => {
      expect.assertions(4);

      expect(() => MalApiValidators.minMax(11, { min: 12, max: 12 })).toThrow(new MalMinMaxValidationError({ value: 11, min: 12, max: 12 }));
      expect(() => MalApiValidators.minMax(13, { min: 12, max: 12, name: 'field' })).toThrow(
        new MalMinMaxValidationError({ value: 13, min: 12, max: 12, name: 'field' }),
      );
      expect(() => MalApiValidators.minMax(9, { min: 10, max: 12 })).toThrow(new MalMinMaxValidationError({ value: 9, min: 10, max: 12 }));
      expect(() => MalApiValidators.minMax(13, { min: 10, max: 12, name: 'field' })).toThrow(
        new MalMinMaxValidationError({ value: 13, min: 10, max: 12, name: 'field' }),
      );
    });
  });

  describe('length', () => {
    it('min', () => {
      expect.assertions(4);

      expect(MalApiValidators.minLength('abcdefg', { min: 3 })).toBeTruthy();
      expect(() => MalApiValidators.minLength([1, 2], { min: 3 })).toThrow(new MalMinValidationError({ value: 2, min: 3 }));
      expect(MalApiValidators.minLength([1, 2, 3, 4], { min: 3, name: 'field' })).toBeTruthy();
      expect(() => MalApiValidators.minLength('ab', { min: 3, name: 'field' })).toThrow(
        new MalMinValidationError({ value: 2, min: 3, name: 'field' }),
      );
    });

    it('max', () => {
      expect.assertions(4);

      expect(MalApiValidators.maxLength('abc', { max: 3 })).toBeTruthy();
      expect(() => MalApiValidators.maxLength('abcd', { max: 3 })).toThrow(new MalMaxValidationError({ value: 4, max: 3 }));
      expect(MalApiValidators.maxLength([1, 2], { max: 3, name: 'field' })).toBeTruthy();
      expect(() => MalApiValidators.maxLength([1, 2, 3, 4], { max: 3, name: 'field' })).toThrow(
        new MalMaxValidationError({ value: 4, max: 3, name: 'field' }),
      );
    });

    it('minMax', () => {
      expect.assertions(4);

      expect(MalApiValidators.minMaxlength('abc', { min: 3, max: 3 })).toBeTruthy();
      expect(() => MalApiValidators.minMaxlength('abcd', { min: 1, max: 3 })).toThrow(new MalMinMaxValidationError({ value: 4, min: 1, max: 3 }));
      expect(MalApiValidators.minMaxlength([1, 2], { min: 1, max: 3, name: 'field' })).toBeTruthy();
      expect(() => MalApiValidators.minMaxlength([1, 2, 3, 4], { min: 1, max: 3, name: 'field' })).toThrow(
        new MalMinMaxValidationError({ value: 4, min: 1, max: 3, name: 'field' }),
      );
    });
  });
});
