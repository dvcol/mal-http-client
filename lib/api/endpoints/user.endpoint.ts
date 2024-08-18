import { ValidatorUtils } from '@dvcol/base-http-client/utils/validator';
import { HttpMethod } from '@dvcol/common-utils';

import type {
  MalAnimeMyListStatus,
  MalAnimeUserListRequest,
  MalAnimeUserListResponse,
  MalAnimeUserListUpdateRequest,
} from '~/models/mal-anime.model';

import type {
  MalMangaMyListStatus,
  MalMangaUserListRequest,
  MalMangaUserListResponse,
  MalMangaUserListUpdateRequest,
} from '~/models/mal-manga.model';
import type { MalUser, MalUserRequest } from '~/models/mal-user.model';

import { MalApiTransforms } from '~/api/transforms/mal-api.transforms';
import { ApiVersion, MalAuthType, MalClientEndpoint } from '~/models/mal-client.model';

export const user = {
  /**
   * Get user information.
   *
   * @auth user
   *
   * @see [user-info]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_get}
   */
  info: new MalClientEndpoint<MalUserRequest, MalUser>({
    method: HttpMethod.GET,
    url: '/users/:id',
    seed: {
      id: '@me',
    },
    opts: {
      auth: MalAuthType.User,
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
  list: {
    anime: {
      /**
       * Get the user's anime list.
       *
       * @auth user or client
       * @pagination true
       * @nsfw true
       *
       * @see [user-anime-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_animelist_get}
       */
      get: new MalClientEndpoint<MalAnimeUserListRequest, MalAnimeUserListResponse>({
        method: HttpMethod.GET,
        url: '/users/:user_name/animelist',
        seed: {
          user_name: '@me',
        },
        opts: {
          nsfw: true,
          auth: MalAuthType.Both,
          version: ApiVersion.v2,
          pagination: {
            limit: 1000,
            offset: 0,
          },
          parameters: {
            path: {
              user_name: true,
            },
            query: {
              status: false,
              sort: false,

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
          if (param.limit) ValidatorUtils.minMax(param.limit, { min: 0, max: 1000, name: 'limit' });
          if (param.offset) ValidatorUtils.min(param.offset, { min: 0, name: 'offset' });
          return true;
        },
      }),
      /**
       * Add specified anime to my anime list.
       *
       * If specified anime already exists, update its status.
       *
       * This endpoint updates only values specified by the parameter.
       *
       * @auth user
       *
       * @see [user-update-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_my_list_status_put}
       */
      update: new MalClientEndpoint<MalAnimeUserListUpdateRequest, MalAnimeMyListStatus, false>({
        method: HttpMethod.PATCH,
        url: '/anime/:anime_id/my_list_status',
        body: {
          status: false,
          is_rewatching: false,
          score: false,
          num_watched_episodes: false,
          num_episodes_watched: false,
          priority: false,
          num_times_rewatched: false,
          rewatch_value: false,
          tags: false,
          comments: false,
        },
        opts: {
          cache: false,
          auth: MalAuthType.User,
          version: ApiVersion.v2,
          parameters: {
            path: {
              anime_id: true,
            },
          },
        },
      }),
      /**
       * If the specified anime does not exist in user's anime list, this endpoint does nothing and returns 404 Not Found.
       *
       * So be careful when retrying.
       *
       * @auth user
       *
       * @see [user-delete-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/anime_anime_id_my_list_status_delete}
       */
      delete: new MalClientEndpoint<
        {
          anime_id: string | number;
        },
        unknown,
        false
      >({
        method: HttpMethod.DELETE,
        url: '/anime/:anime_id/my_list_status',
        opts: {
          cache: false,
          auth: MalAuthType.User,
          version: ApiVersion.v2,
          parameters: {
            path: {
              anime_id: true,
            },
          },
        },
      }),
    },
    manga: {
      /**
       * Get the user's manga list.
       *
       * @auth user or client
       * @pagination true
       * @nsfw true
       *
       * @see [user-manga-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/users_user_id_mangalist_get}
       */
      get: new MalClientEndpoint<MalMangaUserListRequest, MalMangaUserListResponse>({
        method: HttpMethod.GET,
        url: '/users/:user_name/mangalist',
        seed: {
          user_name: '@me',
        },
        opts: {
          nsfw: true,
          auth: MalAuthType.Both,
          version: ApiVersion.v2,
          pagination: {
            limit: 1000,
            offset: 0,
          },
          parameters: {
            path: {
              user_name: true,
            },
            query: {
              status: false,
              sort: false,

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
          if (param.limit) ValidatorUtils.minMax(param.limit, { min: 0, max: 1000, name: 'limit' });
          if (param.offset) ValidatorUtils.min(param.offset, { min: 0, name: 'offset' });
          return true;
        },
      }),
      /**
       * Add specified manga to my manga list.
       *
       * If specified manga already exists, update its status.
       *
       * This endpoint updates only values specified by the parameter.
       *
       * @auth user
       *
       * @see [user-update-manga-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_my_list_status_put}
       */
      update: new MalClientEndpoint<MalMangaUserListUpdateRequest, MalMangaMyListStatus, false>({
        method: HttpMethod.PATCH,
        url: '/manga/:manga_id/my_list_status',
        body: {
          status: false,
          is_rereading: false,
          score: false,
          num_volumes_read: false,
          num_chapters_read: false,
          priority: false,
          num_times_reread: false,
          reread_value: false,
          tags: false,
          comments: false,
        },
        opts: {
          cache: false,
          auth: MalAuthType.User,
          version: ApiVersion.v2,
          parameters: {
            path: {
              manga_id: true,
            },
          },
        },
      }),
      /**
       * @see [user-delete-manga-list]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/manga_manga_id_my_list_status_delete}
       */
      delete: new MalClientEndpoint<
        {
          manga_id: string | number;
        },
        unknown,
        false
      >({
        method: HttpMethod.DELETE,
        url: '/manga/:manga_id/my_list_status',
        opts: {
          cache: false,
          auth: MalAuthType.User,
          version: ApiVersion.v2,
          parameters: {
            path: {
              manga_id: true,
            },
          },
        },
      }),
    },
  },
};
