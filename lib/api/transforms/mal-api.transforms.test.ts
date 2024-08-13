import { describe, expect, it } from 'vitest';

import { MalApiTransforms } from './mal-api.transforms';

import type { MalAnime } from '../../models/mal-anime.model';

import type { MalApiFields } from '../../models/mal-client.model';

describe('mal-api.transforms.ts', () => {
  it('should correctly join array elements with a separator', () => {
    expect.assertions(1);

    const array = ['element1', 'element2', 'element3'];
    const expected = 'element1,element2,element3';

    const result = MalApiTransforms.array.toString(array);
    expect(result).toBe(expected);
  });

  describe('fields', () => {
    it('should return string without transform', () => {
      expect.assertions(1);

      const input: MalApiFields<MalAnime> = 'start_date,end_date';
      expect(MalApiTransforms.fields(input)).toBe(input);
    });

    it('should return array as joined string', () => {
      expect.assertions(1);

      const input: MalApiFields<MalAnime> = ['start_date', 'end_date'];
      const output = 'start_date,end_date';
      expect(MalApiTransforms.fields(input)).toBe(output);
    });

    it('should return flat record as joined string', () => {
      expect.assertions(1);

      const input: MalApiFields<MalAnime> = {
        start_date: 'start_date',
        end_date: 'end_date',
      };
      const output = 'start_date,end_date';
      expect(MalApiTransforms.fields<MalAnime>(input)).toBe(output);
    });

    it('should return nested record as joined string', () => {
      expect.assertions(1);

      const input: MalApiFields<MalAnime> = {
        start_date: 'start_date',
        alternative_titles: ['synonyms', 'en'],
      };
      const output = 'start_date,alternative_titles{synonyms,en}';
      expect(MalApiTransforms.fields<MalAnime>(input)).toBe(output);
    });
  });
});
