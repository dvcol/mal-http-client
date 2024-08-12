import { HttpMethod } from '@dvcol/common-utils';

import type {
  MalAnimeDetails,
  MalAnimeDetailsRequest,
  MalAnimeListRequest,
  MalAnimeListResponse,
  MalAnimeRankingRequest,
  MalAnimeRankingResponse,
  MalAnimeSeasonalRequest,
  MalAnimeSeasonalResponse,
  MalAnimeSuggestionsRequest,
} from '~/models/mal-anime.model';

import { MalApiTransforms } from '~/api/transforms/mal-api.transforms';
import { MalApiValidators } from '~/api/validators/mal-api.validators';
import { ApiVersion, MalAuthType, MalClientEndpoint } from '~/models/mal-client.model';

export const anime = {
  list: {
    /**
     * Get anime list.
     *
     * @pagination true
     * @nsfw true
     * @auth client or user
     *
     * @see [anime-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_get}
     */
    get: new MalClientEndpoint<MalAnimeListRequest, MalAnimeListResponse>({
      method: HttpMethod.GET,
      url: '/anime',
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
        if (param.limit) MalApiValidators.minMax(param.limit, { min: 0, max: 500, name: 'limit' });
        if (param.offset) MalApiValidators.min(param.offset, { min: 0, name: 'offset' });
        return true;
      },
    }),
  },
  /**
   * Get anime details.
   *
   * @auth client or user
   *
   * @see [anime-details]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_get}
   */
  details: new MalClientEndpoint<MalAnimeDetailsRequest, MalAnimeDetails>({
    method: HttpMethod.GET,
    url: '/anime/:id',
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
   * Get anime rankings.
   *
   * @pagination true
   * @auth client or user
   * @nsfw true
   *
   * @see [anime-rankings]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_ranking_get}
   */
  ranking: new MalClientEndpoint<MalAnimeRankingRequest, MalAnimeRankingResponse>({
    method: HttpMethod.GET,
    url: '/anime/ranking',
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
          ranking_type: true,
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
      if (param.limit) MalApiValidators.minMax(param.limit, { min: 0, max: 500, name: 'limit' });
      if (param.offset) MalApiValidators.min(param.offset, { min: 0, name: 'offset' });
      return true;
    },
  }),
  /**
   * Get list of anime airing for season.
   *
   * @auth client or user
   * @pagination true
   * @nsfw true
   *
   * @see [anime-seasonal]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_season_year_season_get}
   */
  seasonal: new MalClientEndpoint<MalAnimeSeasonalRequest, MalAnimeSeasonalResponse>({
    method: HttpMethod.GET,
    url: '/anime/season/:year/:season',
    opts: {
      nsfw: true,
      auth: MalAuthType.Both,
      version: ApiVersion.v2,
      pagination: {
        limit: 500,
        offset: 0,
      },
      parameters: {
        path: {
          year: true,
          season: true,
        },
        query: {
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
      if (param.limit) MalApiValidators.minMax(param.limit, { min: 0, max: 500, name: 'limit' });
      if (param.offset) MalApiValidators.min(param.offset, { min: 0, name: 'offset' });
      return true;
    },
  }),
  /**
   * Get list of suggested anime for a specific anime.
   *
   * Returns suggested anime for the authorized user.
   *
   * If the user is new comer, this endpoint returns an empty list.
   *
   * @auth user
   * @pagination true
   * @nsfw true
   *
   *@see [anime-suggestions]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_suggestions_get}
   */
  suggestions: new MalClientEndpoint<MalAnimeSuggestionsRequest, MalAnimeListResponse>({
    method: HttpMethod.GET,
    url: '/anime/suggestions',
    opts: {
      nsfw: true,
      auth: MalAuthType.Main,
      version: ApiVersion.v2,
      pagination: {
        limit: 500,
        offset: 0,
      },
      parameters: {
        query: {
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
      if (param.limit) MalApiValidators.minMax(param.limit, { min: 0, max: 500, name: 'limit' });
      if (param.offset) MalApiValidators.min(param.offset, { min: 0, name: 'offset' });
      return true;
    },
  }),
};
