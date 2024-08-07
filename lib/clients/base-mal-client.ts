import { type BaseBody, BaseClient } from '@dvcol/base-http-client';

import { injectCorsProxyPrefix, parseBody, parseUrl, patchResponse } from '@dvcol/base-http-client/utils/client';
import { BaseApiHeaders, BaseHeaderContentType } from '@dvcol/base-http-client/utils/http';

import type { MalApi } from '~/api/mal-api.endpoints';

import type {
  IMalApi,
  MalApiParam,
  MalApiQuery,
  MalApiResponse,
  MalApiResponseData,
  MalApiTemplate,
  MalClientOptions,
  MalClientSettings,
} from '~/models/mal-client.model';

import { type IMalClientAuthentication, MalClientAuthentication } from '~/models/mal-authentication.model';
import { MalApiHeader, MalAuthType } from '~/models/mal-client.model';

import { MalExpiredTokenError, MalInvalidParameterError } from '~/models/mal-error.model';

/** Needed to type Object assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging  -- To allow type extension
export interface BaseMalClient extends MalApi {}

const parseResponse = (result: MalApiResponseData) => {
  return result.paging ? { data: result.data, pagination: result.paging } : result.data;
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
  protected _parseHeaders<T extends MalApiParam = MalApiParam>(template: MalApiTemplate<T>): HeadersInit {
    const headers: HeadersInit = {
      [BaseApiHeaders.UserAgent]: this.settings.useragent,
      [BaseApiHeaders.ContentType]: BaseHeaderContentType.Json,
      [MalApiHeader.MalClientId]: this.settings.client_id,
    };

    if (template.opts?.auth === MalAuthType.ClientAuth) {
      if (!this.auth.access_token) throw new MalInvalidParameterError('OAuth required: access_token is missing');
      else if (this.auth.isExpired()) throw new MalExpiredTokenError('OAuth required: access_token has expired');
      else headers[BaseApiHeaders.Authorization] = `Bearer ${this.auth.access_token}`;
    }

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
  protected _parseUrl<T extends MalApiParam = MalApiParam>(template: MalApiTemplate<T>, params: T): URL {
    const _template = injectCorsProxyPrefix(template, this.settings);
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
  protected _parseBody<T extends MalApiParam = MalApiParam>(template: BaseBody<string | keyof T>, params: T): BodyInit {
    return parseBody(template, params);
  }

  /**
   * Parses the response from the API before returning from the call.
   * @param response - The response from the API.
   *
   * @returns {MalApiResponse} The parsed response.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this -- implemented from abstract class
  protected _parseResponse(response: MalApiResponse<MalApiResponseData>): MalApiResponse {
    if (!response.ok || response.status >= 400) throw response;

    const parsed: MalApiResponse = patchMalResponse(response);
    const _clone = parsed.clone;
    parsed.clone = () => patchMalResponse(_clone.bind(parsed)());
    return parsed;
  }
}
