import { HttpMethod } from '@dvcol/common-utils';

import type { MalAuthenticationToken, MalAuthorizeRequest, MalTokenExchangeRequest, MalTokenRefreshRequest } from '~/models/mal-authentication.model';

import { Config } from '~/config';
import { ApiVersion, MalClientEndpoint } from '~/models/mal-client.model';

/**
 * @see [authentication]{@link https://myanimelist.net/apiconfig/references/authorization#obtaining-oauth-20-access-tokens}
 */
export const authentication = {
  /**
   * Request an authorization code.
   * @see [authorize]{@link https://myanimelist.net/apiconfig/references/authorization#step-2-client-requests-oauth-20-authentication}
   */
  authorize: new MalClientEndpoint<MalAuthorizeRequest, unknown, false>({
    method: HttpMethod.GET,
    url: '/oauth2/authorize',
    seed: {
      response_type: 'code',
    },
    init: {
      redirect: 'manual',
      credentials: 'omit',
    },
    opts: {
      version: ApiVersion.v1,
      endpoint: Config.Website,
      cache: false,
      parameters: {
        query: {
          client_id: true,
          code_challenge: true,
          code_challenge_method: false,
          state: false,
          redirect_uri: false,
          response_type: true,
        },
      },
    },
  }),
  token: {
    /**
     * Exchange the authorization code for an access token.
     * @see [documentation]{@link https://myanimelist.net/apiconfig/references/authorization#obtaining-oauth-20-access-tokens}
     */
    exchange: new MalClientEndpoint<MalTokenExchangeRequest, MalAuthenticationToken, false>({
      method: HttpMethod.POST,
      url: '/oauth2/token',
      seed: {
        grant_type: 'authorization_code',
      },
      opts: {
        version: ApiVersion.v1,
        endpoint: Config.Website,
        cache: false,
      },
      body: {
        client_id: true,
        client_secret: true,
        code: true,
        code_verifier: true,
        redirect_uri: false,
        grant_type: true,
      },
    }),
    /**
     *
     */
    refresh: new MalClientEndpoint<MalTokenRefreshRequest, MalAuthenticationToken, false>({
      method: HttpMethod.POST,
      url: '/oauth2/token',
      seed: {
        grant_type: 'refresh_token',
      },
      opts: {
        version: ApiVersion.v1,
        endpoint: Config.Website,
        cache: false,
      },
      body: {
        client_id: true,
        client_secret: true,
        refresh_token: true,
        grant_type: false,
      },
    }),
  },
};
