import { ClientEndpoint } from '@dvcol/base-http-client';

import type {
  BaseOptions,
  BaseQuery,
  BaseRequest,
  BaseSettings,
  BaseTemplate,
  BaseTemplateOptions,
  ResponseOrTypedResponse,
} from '@dvcol/base-http-client';

import type { RecursiveRecord } from '@dvcol/common-utils/common/models';
import type { CancellablePromise } from '@dvcol/common-utils/http/fetch';

export const ApiVersion = {
  v1: 'v1',
  v2: 'v2',
} as const;

export type ApiVersions = (typeof ApiVersion)[keyof typeof ApiVersion];

/**
 * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2}
 */
export type MalClientSettings = BaseSettings<{
  /** The client ID you received from MyAnimeList when you registered your application. */
  client_id: string;
  /** The client secret you received from MyAnimeList when you registered your application. */
  client_secret: string;
  /** URI specified in your app settings. */
  redirect_uri?: string;

  /** The consumer client identifier */
  useragent: string;

  /** The access token lifetime in seconds */
  TokenTTL: number;
  /** The refresh token lifetime in seconds */
  RefreshTokenTTL: number;
}>;

export type MalApiQuery<T = unknown> = BaseQuery<BaseRequest, T>;

export type MalApiResponse<T = unknown> = ResponseOrTypedResponse<T>;

export type MalApiResponseErrorData = {
  message: string;
  error: string;
};

export type MalApiRawPaginatedData<T = unknown> = {
  data: T;
  paging: {
    previous?: string;
    next?: string;
  };
};

export type MalApiPagination = {
  /** Default: 0 */
  offset: number;
  /** Default: 100 */
  limit: number;
};

export type MalApiPaginatedData<T = unknown, Meta = Record<string, never>> = {
  data: T;
  pagination: {
    previous?: MalApiPagination & { link: string };
    next?: MalApiPagination & { link: string };
  };
} & Meta;

export type MalApiFields<T extends RecursiveRecord> =
  | string
  | (keyof T)[]
  | Partial<{
      [K in keyof T]: string | (keyof T[K])[];
    }>;

export type MalClientOptions = BaseOptions<MalClientSettings, MalApiResponse>;

export type MalApiParam = RecursiveRecord;

export const MalApiHeader = {
  MalClientId: 'X-MAL-CLIENT-ID',
} as const;

export type MalApiHeaders = (typeof MalApiHeader)[keyof typeof MalApiHeader];

/**
 * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2#section/Authentication}
 */
export const MalAuthType = {
  /**
   * Main auth (user OAuth)
   *
   * The API client can see and modify basic profile information and users' list data, post information to MyAnimelist on behalf of users.
   * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2#section/Authentication}
   **/
  User: 'main_auth',
  /**
   * When user login is not required, the X-MAL-CLIENT-ID request header can be used to authenticate the client by setting your API client ID.
   * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2#section/Authentication}
   */
  Client: 'client_auth',
  /**
   * Either {@link User} or {@link Client} auth
   * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2#section/Authentication}
   */
  Both: 'both_auth',
} as const;

export type MalAuthTypes = (typeof MalAuthType)[keyof typeof MalAuthType];

/**
 * Represents options that can be used in a Mal API template.
 */
export type MalApiTemplateOptions<T extends string | number | symbol = string> = BaseTemplateOptions<T, boolean> & {
  /** The API version to use */
  version: ApiVersions;
  /** If the method requires authentication */
  auth?: MalAuthTypes | false;
  /** If the method supports/requires nsfw filters */
  nsfw?: boolean;
  /** If the method supports/requires pagination */
  pagination?:
    | {
        /** The minimum value */
        offset?: number;
        /** The maximum value **/
        limit?: number;
      }
    | false;
};

export type MalApiTemplate<Parameter extends MalApiParam = MalApiParam> = BaseTemplate<Parameter, MalApiTemplateOptions<keyof Parameter>>;

export interface MalClientEndpoint<Parameter extends MalApiParam = Record<string, never>, Response = unknown> {
  (param?: Parameter, init?: BodyInit): CancellablePromise<MalApiResponse<Response>>;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class MalClientEndpoint<
  Parameter extends MalApiParam = Record<string, never>,
  Response = unknown,
  Cache extends boolean = true,
> extends ClientEndpoint<Parameter, Response, Cache, MalApiTemplateOptions<keyof Parameter>> {}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is a recursive type
export type IMalApi<Parameter extends MalApiParam = any, Response = unknown, Cache extends boolean = boolean> = {
  [key: string]: MalClientEndpoint<Parameter, Response, Cache> | IMalApi<Parameter>;
};
