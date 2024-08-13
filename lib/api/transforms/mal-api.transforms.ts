import type { RecursiveRecord } from '@dvcol/common-utils';

import type { MalApiFields } from '~/models/mal-client.model';

export const MalApiTransforms = {
  array: {
    /** Join array elements with separator (defaults to comma ',') */
    toString: <T extends string>(arrayOrString: T | T[], separator = ',') => {
      if (arrayOrString && Array.isArray(arrayOrString)) return arrayOrString.join(separator) as T;
      return arrayOrString as T;
    },
  },
  fields: <T extends RecursiveRecord>(fields: MalApiFields<T>): string => {
    if (typeof fields === 'string') return fields;
    if (Array.isArray(fields)) return fields.join(',');
    return Object.entries(fields)
      .map(([key, value]: [string, string | string[]]) => {
        if (!value?.length) return;
        if (Array.isArray(value)) return `${key}{${value.join(',')}}`;
        return value;
      })
      .join(',');
  },
};
