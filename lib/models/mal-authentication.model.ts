export type MalAuthenticationToken = {
  token_type: 'Bearer';
  expires_in: number;
  access_token: string;
  refresh_token: string;
};

export type IMalClientAuthentication = {
  refresh_token?: string;
  access_token?: string;
  created?: number;
  expires?: number;
  state?: string;
  code?: string;
};

const isToken = (token: MalAuthenticationToken | IMalClientAuthentication): token is MalAuthenticationToken => 'token_type' in token;

export class MalClientAuthentication implements IMalClientAuthentication {
  refresh_token: string;
  access_token: string;
  created: number;
  expires: number;
  state?: string;
  code?: string;

  constructor(
    authentication: IMalClientAuthentication | MalAuthenticationToken,
    { state, code }: Pick<IMalClientAuthentication, 'state' | 'code'> = {},
  ) {
    this.refresh_token = authentication.refresh_token;
    this.access_token = authentication.access_token;

    if (isToken(authentication)) {
      this.created = Date.now();
      this.expires = this.created + authentication.expires_in * 1000;
      this.state = state;
      this.code = code;
    } else {
      this.created = authentication.created;
      this.expires = authentication.expires;
      this.state = authentication.state ?? state;
      this.code = authentication.code;
    }
  }

  static isExpired(expires: number): boolean {
    if (expires === undefined) return false;
    return expires < Date.now();
  }

  isExpired(expires = this.expires): boolean {
    return MalClientAuthentication.isExpired(expires);
  }
}

export type MalAuthorizeRequest = {
  /** The client ID you received from MyAnimeList when you registered your application. */
  client_id: string;
  /**
   * A minimum length of 43 characters and a maximum length of 128 characters.
   * @see [details for the PKCE code_challenge]{@link https://tools.ietf.org/html/rfc7636}
   * @see [documentation]{@link https://myanimelist.net/apiconfig/references/authorization#step-1-generate-a-code-verifier-and-challenge}
   */
  code_challenge: string;
  /**
   * Defaults to plain if not present in the request.
   * Currently, only the plain method is supported.
   */
  code_challenge_method?: string | 'plain' | 'S256';
  /**
   * An optional CSRF token.
   * @see [CSRF]{@link https://tools.ietf.org/html/rfc6749#section-4.1.1}
   **/
  state?: string;
  /**
   * If you registered only one redirection URI in advance, you can omit this parameter.
   * If you set this, the value must exactly match one of your pre-registered URIs.
   */
  redirect_uri?: string;
  /** Value MUST be set to “code”. */
  response_type?: 'code';
};

export type MalTokenExchangeRequest = {
  /** The client ID you received from MyAnimeList when you registered your application. */
  client_id: string;
  /** The client secret you received from MyAnimeList when you registered your application. */
  client_secret: string;
  /**
   * The authorization code you got in the previous step.
   */
  code: string;
  /**
   * A minimum length of 43 characters and a maximum length of 128 characters.
   * [See the detail of PKCE code_challenge.]{@link https://tools.ietf.org/html/rfc7636}
   */
  code_verifier: string;
  /**
   * The value of this parameter must be identical to one that is included the previous authorization request.
   * You can omit this parameter only when you registered only one redirection URI in advance and you didn’t add the redirect_uri parameter to the authorization request you sent in the [previous step]{@link https://myanimelist.net/apiconfig/references/authorization#step-2-client-requests-oauth-20-authentication}.
   */
  redirect_uri?: string;
  /** Value MUST be set to “authorization_code”. */
  grant_type?: 'authorization_code';
};

export type MalTokenRefreshRequest = {
  /** The client ID you received from MyAnimeList when you registered your application. */
  client_id: string;
  /** The client secret you received from MyAnimeList when you registered your application. */
  client_secret: string;
  /** The refresh token you received from the token exchange. */
  refresh_token: string;
  /** Value MUST be set to “refresh_token”. */
  grant_type?: 'refresh_token';
};

export type MalAuthorizeQuery = Partial<Omit<MalAuthorizeRequest, 'client_id' | 'response_type'>> & {
  redirect?: RequestRedirect;
};

export type MalTokenExchangeQuery = Partial<Omit<MalTokenExchangeRequest, 'client_id' | 'client_secret' | 'grant_type'>>;
