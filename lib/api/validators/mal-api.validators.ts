import { MalMaxValidationError, MalMinMaxValidationError, MalMinValidationError, MalNaNValidationError } from '~/models/mal-error.model';

export const MalApiValidators = {
  isNumber: (value: string | number, name?: string) => {
    const _value = Number(value);
    if (Number.isNaN(_value)) throw new MalNaNValidationError(value, name);
    return _value;
  },
  max: (value: number | string, { max, name }: { max: number; name?: string }) => {
    const _value = MalApiValidators.isNumber(value);
    if (_value > max) throw new MalMaxValidationError({ value: _value, max, name });
    return _value;
  },
  min: (value: number | string, { min, name }: { min: number; name?: string }) => {
    const _value = MalApiValidators.isNumber(value);
    if (_value < min) throw new MalMinValidationError({ value: _value, min, name });
    return _value;
  },
  minMax: (value: number | string, { min, max, name }: { min: number; max: number; name?: string }) => {
    const _value = MalApiValidators.isNumber(value);
    if (_value < min || _value > max) throw new MalMinMaxValidationError({ value: _value, min, max, name });
    return _value;
  },
  maxLength: (value: string | { length: number }, { max, name }: { max: number; name?: string }) => {
    return MalApiValidators.max(value.length, { max, name });
  },
  minLength: (value: string | { length: number }, { min, name }: { min: number; name?: string }) => {
    return MalApiValidators.min(value.length, { min, name });
  },
  minMaxlength: (value: string | { length: number }, { min, max, name }: { min: number; max: number; name?: string }) => {
    return MalApiValidators.minMax(value.length, { min, max, name });
  },
};
