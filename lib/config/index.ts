import { ApiVersion } from '~/models/mal-client.model';

/**
 * The configuration for the MyAnimeList API.
 */
export const Config = {
  Endpoint: 'https://api.myanimelist.net',
  Website: 'https://myanimelist.net',
  Version: ApiVersion,
  /**
   * Access Token lifetime in seconds (1 hour).
   * @see [documentation]{@link https://myanimelist.net/apiconfig/references/authorization#overview}
   */
  TokenTTL: 60 * 60,
  /**
   * Refresh Token lifetime in seconds (28 days).
   * @see [documentation]{@link https://myanimelist.net/apiconfig/references/authorization#overview}
   */
  RefreshTokenTTL: 60 * 60 * 24 * 28,
} as const;
