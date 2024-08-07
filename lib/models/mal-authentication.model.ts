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
};

const isToken = (token: MalAuthenticationToken | IMalClientAuthentication): token is MalAuthenticationToken => 'token_type' in token;

export class MalClientAuthentication implements IMalClientAuthentication {
  refresh_token: string;
  access_token: string;
  created: number;
  expires: number;
  state?: string;

  constructor(authentication: IMalClientAuthentication | MalAuthenticationToken, state?: string) {
    this.refresh_token = authentication.refresh_token;
    this.access_token = authentication.access_token;

    if (isToken(authentication)) {
      this.created = Date.now();
      this.expires = this.created + authentication.expires_in * 1000;
      this.state = state;
    } else {
      this.created = authentication.created;
      this.expires = authentication.expires;
      this.state = authentication.state ?? state;
    }
  }

  isExpired(): boolean {
    if (this.expires === undefined) return false;
    return this.expires < Date.now();
  }
}
