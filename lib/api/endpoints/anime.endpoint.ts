import { HttpMethod } from '@dvcol/common-utils';

import type { MalAnime, MalAnimeListRequest } from '~/models/mal-anime.model';
import type { MalApiPaginatedData } from '~/models/mal-client.model';

import { MalApiTransforms } from '~/api/transforms/mal-api.transforms';
import { MalApiValidators } from '~/api/validators/mal-api.validators';
import { ApiVersion, MalAuthType, MalClientEndpoint } from '~/models/mal-client.model';

export const anime = {
  /**
   * Get anime list.
   *
   * @pagination true
   * @nsfw true
   * @auth client or user
   *
   * @see [anime-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get}
   */
  list: new MalClientEndpoint<MalAnimeListRequest, MalApiPaginatedData<{ node: MalAnime }>>({
    method: HttpMethod.GET,
    url: '/anime',
    opts: {
      auth: MalAuthType.Both,
      version: ApiVersion.v2,
      pagination: {
        limit: 100,
        offset: 0,
      },
      nsfw: true,
      parameters: {
        query: {
          q: false,
          fields: false,
          nsfw: false,
          limit: false,
          offset: false,
        },
      },
    },
    transform: param => {
      if (param.fields) return { ...param, fields: MalApiTransforms.fields(param.fields) };
      return param;
    },
    validate: param => {
      if (param.limit) MalApiValidators.minMax(param.limit, { min: 0, max: 100, name: 'limit' });
      if (param.offset) MalApiValidators.min(param.offset, { min: 0, name: 'offset' });
      return true;
    },
  }),
};
