import { PKCECodeGenerator } from '@dvcol/common-utils/common/crypto';

import type { BaseInit } from '@dvcol/base-http-client';

import type { IMalClientAuthentication, MalAuthorizeQuery, MalTokenExchangeQuery } from '~/models/mal-authentication.model';

import type { IMalApi, MalClientOptions } from '~/models/mal-client.model';

import { minimalMalApi } from '~/api/mal-api-minimal.endpoints';

import { BaseMalClient } from '~/clients/base-mal-client';
import { MalClientAuthentication } from '~/models/mal-authentication.model';
import { MalInvalidCsrfError, MalInvalidParameterError } from '~/models/mal-error.model';

/**
 * MalClient is a wrapper around the MalApi to provide basic authentication and state management.
 *
 * @class MalClient
 *
 * @extends {BaseMalClient}
 */
export class MalClient extends BaseMalClient {
  /**
   * The url to redirect to after the user has authorized the application.
   */
  get redirectUri() {
    return this.settings.redirect_uri;
  }

  /**
   * Creates an instance of MalClient, with the necessary endpoints and settings.
   * @param settings - The settings for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(settings: MalClientOptions, authentication: IMalClientAuthentication = {}, api: IMalApi = minimalMalApi) {
    super(settings, authentication, api);
  }

  /**
   * Initiates the OAuth process by redirecting to the MyAnimeList website.
   * Users will be prompted to sign in and authorize the application.
   *
   * Once redirected back to the application, the code should be exchanged for an access token.
   *
   * @param redirect - The type of redirect to use (defaults to manual).
   * @param redirect_uri - The URL to redirect to after the user has authorized the application (defaults to client settings).
   * @param request.code_challenge - The code challenge to match against the code verifier.
   * @param request.state - The optional CSRF token to verify the state.
   * @param request - Additional parameters for the authorization request.
   * @returns A promise resolving to the response from the MyAnimeList website.
   *
   * @see [authorize]{@link https://myanimelist.net/apiconfig/references/authorization#step-2-client-requests-oauth-20-authentication}
   */
  async authorize({ redirect, redirect_uri, ...request }: MalAuthorizeQuery = {}) {
    const code_challenge = request.code_challenge ?? (await PKCECodeGenerator.code());
    const state = request.state ?? (await PKCECodeGenerator.code());
    this.updateAuth(auth => new MalClientAuthentication(auth, { state, code: code_challenge }));
    const init: BaseInit = { credentials: 'omit' };
    if (redirect) init.redirect = redirect;
    return this.authentication.authorize(
      {
        response_type: 'code',
        client_id: this.settings.client_id,
        redirect_uri: redirect_uri ?? this.settings.redirect_uri,
        ...request,
        code_challenge,
        state,
      },
      init,
    );
  }

  /**
   * Initiates the OAuth process by generating a URL to the MyAnimeList website.
   * Users will be prompted to sign in and authorize the application.
   *
   * Once redirected back to the application, the code should be exchanged for an access token with {@link exchangeCodeForToken}.
   *
   * @param redirect_uri - The URL to redirect to after the user has authorized the application (defaults to client settings).
   * @param request - Additional parameters for the authorization request.
   * @returns A promise resolving to the response from the MyAnimeList website.
   *
   * @see [authorize]{@link https://myanimelist.net/apiconfig/references/authorization#step-2-client-requests-oauth-20-authentication}
   */
  async resolveAuthorizeUrl({ redirect_uri, ...request }: Omit<MalAuthorizeQuery, 'redirect'> = {}) {
    const code_challenge = request.code_challenge ?? (await PKCECodeGenerator.code());
    const state = request.state ?? (await PKCECodeGenerator.code());
    this.updateAuth(auth => new MalClientAuthentication(auth, { state, code: code_challenge }));
    return this.authentication.authorize
      .resolve({
        response_type: 'code',
        client_id: this.settings.client_id,
        redirect_uri: redirect_uri ?? this.settings.redirect_uri,
        ...request,
        code_challenge,
        state,
      })
      .toString();
  }

  /**
   * Exchanges the authorization code obtained after the user has authorized the application with {@link authorize} or {@link resolveAuthorizeUrl}.
   *
   * @param  code - The authorization code obtained from the user.
   * @param code_verifier - The code verifier to match again the code challenge.
   * @param redirect_uri - The URL to redirect to after the user has authorized the application (defaults to client settings).
   * @param  state - The optional CSRF token to verify the state.
   *
   * @returns  A promise resolving to the Trakt authentication information.
   *
   * @throws Error Throws an error if the CSRF token is invalid.
   */
  async exchangeCodeForToken({ code, code_verifier, redirect_uri }: MalTokenExchangeQuery, state?: string) {
    if (state && state !== this.auth.state) throw new MalInvalidCsrfError({ state, expected: this.auth.state });

    const response = await this.authentication.token.exchange({
      code,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret,
      code_verifier: code_verifier ?? this.auth.code,
      redirect_uri: redirect_uri ?? this.settings.redirect_uri,
    });

    const token = await response.json();

    this.updateAuth(_ => new MalClientAuthentication(token, { state, code: code_verifier }));

    return this.auth;
  }

  /**
   * Refreshes the access token using the refresh token.
   *
   * @returns  A promise resolving to the updated Trakt authentication information.
   * @param refresh_token - The refresh token to use (defaults to the stored refresh token).
   *
   * @throws Error Throws an error if no refresh token is found.
   */
  async refreshAccessToken(refresh_token = this.auth.refresh_token) {
    if (!refresh_token) throw new MalInvalidParameterError('No refresh token found.');

    const response = await this.authentication.token.refresh({
      refresh_token,
      client_id: this.settings.client_id,
      client_secret: this.settings.client_secret,
      grant_type: 'refresh_token',
    });

    const token = await response.json();

    this.updateAuth(auth => new MalClientAuthentication(token, auth));

    return this.auth;
  }

  /**
   * Imports the provided authentication information into the client.
   * If the access token is expired, it attempts to refresh it.
   *
   * @param auth - The authentication information to import.
   *
   * @returns A promise resolving to the imported authentication information.
   */
  async importAuthentication(auth: IMalClientAuthentication = {}): Promise<MalClientAuthentication> {
    if (MalClientAuthentication.isExpired(auth.expires)) return this.refreshAccessToken(auth.refresh_token);

    this.updateAuth(new MalClientAuthentication(auth));
    return this.auth;
  }
}
