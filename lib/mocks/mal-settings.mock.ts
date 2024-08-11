import type { MalClientSettings } from '~/models/mal-client.model';

import { Config } from '~/config';

export const malClientSettings: MalClientSettings = {
  client_id: 'my-client-id',
  client_secret: 'my-client-secret',
  redirect_uri: 'my-redirect-uri',

  endpoint: Config.endpoint,
  TokenTTL: Config.TokenTTL,
  RefreshTokenTTL: Config.RefreshTokenTTL,

  useragent: 'my-user-agent',
};
