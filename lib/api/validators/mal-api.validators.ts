import { MalValidationError } from '~/models/mal-error.model';

export const MalApiValidators = {
  isNumber: (value: string | number, name?: string) => {
    const _value = Number(value);
    if (Number.isNaN(_value)) throw new MalValidationError(`Expected a valid number${name ? ` for '${name}'` : ''}, but received '${value}'.`);
    return _value;
  },
  max: (value: number | string, { max, name }: { max: number; name?: string }) => {
    const _value = MalApiValidators.isNumber(value);
    if (_value > max) {
      throw new MalValidationError(`Expected a number more than or equal to '${max}'${name ? ` for '${name}'` : ''}, but received '${_value}'.`);
    }
    return _value;
  },
  min: (value: number | string, { min, name }: { min: number; name?: string }) => {
    const _value = MalApiValidators.isNumber(value);
    if (_value < min) {
      throw new MalValidationError(`Expected a number less than or equal to '${min}'${name ? ` for '${name}'` : ''}, but received '${_value}'.`);
    }
    return _value;
  },
  minMax: (value: number | string, { min, max, name }: { min: number; max: number; name?: string }) => {
    const _value = MalApiValidators.isNumber(value);
    if (_value < min || _value > max) {
      throw new MalValidationError(`Expected a number between '${min}' and '${max}'${name ? ` for '${name}'` : ''}, but received '${_value}'.`);
    }
    return _value;
  },
};
