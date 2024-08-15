import { type BaseBody, BaseClient } from '@dvcol/base-http-client';

import { injectCorsProxyPrefix, injectUrlPrefix, parseBodyUrlEncoded, parseUrl, patchResponse } from '@dvcol/base-http-client/utils/client';
import { BaseApiHeaders, BaseHeaderContentType } from '@dvcol/base-http-client/utils/http';

import { HttpMethod } from '@dvcol/common-utils';

import type { RecursiveRecord } from '@dvcol/common-utils/common/models';
import type { MalApi } from '~/api/mal-api.endpoints';

import type {
  IMalApi,
  MalApiPaginatedData,
  MalApiParams,
  MalApiQuery,
  MalApiRawPaginatedData,
  MalApiResponse,
  MalApiTemplate,
  MalClientOptions,
  MalClientSettings,
} from '~/models/mal-client.model';

import { type IMalClientAuthentication, MalClientAuthentication } from '~/models/mal-authentication.model';
import { MalApiHeader, MalAuthType } from '~/models/mal-client.model';

import { MalExpiredTokenError, MalInvalidParameterError, MalRateLimitError } from '~/models/mal-error.model';

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseMalClient extends MalApi {}

const parsePagingLinks = (link: string): { offset: number; limit: number } => {
  const params = new URLSearchParams(link.split('?')[1] ?? link);
  return {
    offset: Number(params.get('offset')),
    limit: Number(params.get('limit')),
  };
};

const isPagedData = <T extends RecursiveRecord = unknown>(data: T | MalApiRawPaginatedData<T>): data is MalApiRawPaginatedData<T> => 'paging' in data;

export const parseResponse = <T extends RecursiveRecord = unknown>(response: T | MalApiRawPaginatedData<T>) => {
  if (!isPagedData(response)) return response;
  const result: Partial<MalApiPaginatedData> = {
    data: response.data,
    pagination: {},
  };
  if (response.paging.previous) result.pagination.previous = { ...parsePagingLinks(response.paging.previous), link: response.paging.previous };
  if (response.paging.next) result.pagination.next = { ...parsePagingLinks(response.paging.next), link: response.paging.next };
  return result;
};

const patchMalResponse = <T extends Response>(response: T): T => patchResponse(response, parseResponse);

/**
 * Represents a Mal API client with common functionality.
 *
 * @class BaseMalClient
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export class BaseMalClient extends BaseClient<MalApiQuery, MalApiResponse, MalClientSettings, MalClientAuthentication> implements MalApi {
  /**
   * Creates an instance of BaseMalClient.
   * @param options - The options for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(options: MalClientOptions, authentication: IMalClientAuthentication = {}, api: IMalApi = {}) {
    const _authentication = authentication instanceof MalClientAuthentication ? authentication : new MalClientAuthentication(authentication);
    super(options, _authentication, api);
  }

  /**
   * Parses the template to construct the headers for a Mal API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param {MalApiTemplate<T>} template - The template for the API endpoint.
   *
   * @returns {HeadersInit} The parsed request headers.
   *
   * @throws {Error} Throws an error if OAuth is required and the access token is missing.
   */
  protected _parseHeaders<T extends MalApiParams = MalApiParams>(template: MalApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [BaseApiHeaders.UserAgent]: this.settings.useragent,
      [BaseApiHeaders.ContentType]: [HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH].map(String).includes(template.method)
        ? BaseHeaderContentType.FormUrlEncoded
        : BaseHeaderContentType.Json,
      [MalApiHeader.MalClientId]: this.settings.client_id,
      [MalApiHeader.MalApiVersion]: template.opts?.version,
    };

    if (template.opts?.auth === MalAuthType.Client && !this.settings.client_id) {
      throw new MalInvalidParameterError('OAuth required: client_id is missing');
    }
    if (template.opts?.auth === MalAuthType.User) {
      if (!this.auth.access_token) throw new MalInvalidParameterError('OAuth required: access_token is missing');
      else if (this.auth.isExpired()) throw new MalExpiredTokenError('OAuth required: access_token has expired');
    }
    if (template.opts?.auth && this.auth.access_token) headers[BaseApiHeaders.Authorization] = `Bearer ${this.auth.access_token}`;

    return headers;
  }

  /**
   * Parses the parameters and constructs the URL for a Mal API request.
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The template for the API endpoint.
   * @param {T} params - The parameters for the API call.
   *
   * @returns {string} The URL for the Mal API request.
   *
   * @throws {Error} Throws an error if mandatory parameters are missing or if a filter is not supported.
   */
  protected _parseUrl<T extends MalApiParams = MalApiParams>(template: MalApiTemplate<T>, params: T): URL {
    const versionedTemplate = injectUrlPrefix(`/${template.opts.version}`, template);
    if (template.opts.endpoint) return parseUrl<T>(versionedTemplate, params, template.opts.endpoint);
    const _template = injectCorsProxyPrefix(versionedTemplate, this.settings);
    return parseUrl<T>(_template, params, this.settings.endpoint);
  }

  /**
   * Parses body from a template and stringifies a {@link BodyInit}
   *
   * @protected
   *
   * @template T - The type of the parameters.
   *
   * @param template - The expected body structure.
   * @param {T} params - The actual parameters.
   *
   * @returns {BodyInit} The parsed request body.
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseBody<T extends MalApiParams = MalApiParams>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    return parseBodyUrlEncoded(template, params);
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {MalApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse<T extends RecursiveRecord = unknown>(
    response: MalApiResponse<T> | MalApiResponse<MalApiRawPaginatedData<T>>,
  ): MalApiResponse {
    if (response.status === 401 && response.headers.get(BaseApiHeaders.Authenticate)?.includes('token expired')) {
      throw new MalExpiredTokenError('OAuth required: access_token has expired', response);
    }
    if (response.status === 429) throw new MalRateLimitError(response.statusText, response);
    if (!response.ok || response.status >= 400) throw response;

    const parsed: MalApiResponse = patchMalResponse(response);
    const _clone = parsed.clone;
    parsed.clone = () => patchMalResponse(_clone.bind(parsed)());
    return parsed;
  }
}
