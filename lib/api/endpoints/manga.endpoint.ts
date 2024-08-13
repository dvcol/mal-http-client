import { HttpMethod } from '@dvcol/common-utils';

import type {
  MalMangaDetails,
  MalMangaDetailsRequest,
  MalMangaListRequest,
  MalMangaListResponse,
  MalMangaRankingRequest,
  MalMangaRankingResponse,
} from '~/models/mal-manga.model';

import { MalApiTransforms } from '~/api/transforms/mal-api.transforms';
import { MalApiValidators } from '~/api/validators/mal-api.validators';
import { ApiVersion, MalAuthType, MalClientEndpoint } from '~/models/mal-client.model';

export const manga = {
  /**
   * Get manga list
   *
   * @auth client or user
   * @pagination true
   * @nsfw true
   *
   * @see [manga-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/manga_get}
   */
  list: new MalClientEndpoint<MalMangaListRequest, MalMangaListResponse>({
    method: HttpMethod.GET,
    url: '/manga',
    opts: {
      nsfw: true,
      auth: MalAuthType.Both,
      version: ApiVersion.v2,
      pagination: {
        limit: 500,
        offset: 0,
      },
      parameters: {
        query: {
          q: true,

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
      if (param.q) MalApiValidators.minLength(param.q, { min: 3, name: 'q' });
      if (param.limit) MalApiValidators.minMax(param.limit, { min: 0, max: 500, name: 'limit' });
      if (param.offset) MalApiValidators.min(param.offset, { min: 0, name: 'offset' });
      return true;
    },
  }),
  /**
   * Get manga details.
   *
   * @auth client or user
   *
   * @see [manga-details]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_get}
   */
  details: new MalClientEndpoint<MalMangaDetailsRequest, MalMangaDetails>({
    method: HttpMethod.GET,
    url: '/manga/:id',
    opts: {
      auth: MalAuthType.Both,
      version: ApiVersion.v2,
      parameters: {
        path: {
          id: true,
        },
        query: {
          fields: false,
        },
      },
    },
    transform: param => {
      if (param.fields) return { ...param, fields: MalApiTransforms.fields(param.fields) };
      return param;
    },
  }),
  /**
   * Get manga rankings.
   *
   * The returned manga contains the ranking field.
   *
   * @auth client or user
   * @pagination true
   * @nsfw true
   *
   * @see [manga-rankings]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/manga_ranking_get}
   */
  ranking: new MalClientEndpoint<MalMangaRankingRequest, MalMangaRankingResponse>({
    method: HttpMethod.GET,
    url: '/manga/ranking',
    opts: {
      nsfw: true,
      auth: MalAuthType.Both,
      version: ApiVersion.v2,
      pagination: {
        limit: 500,
        offset: 0,
      },
      parameters: {
        query: {
          ranking_type: false,

          fields: false,
          nsfw: false,
          limit: false,
          offset: false,
        },
      },
    },
  }),
};
