import type { MalClientSettings } from '~/models/mal-client.model';

import { Config } from '~/config';

export const malClientSettingsMock: MalClientSettings = {
  client_id: 'my-client-id',
  client_secret: 'my-client-secret',
  redirect_uri: 'my-redirect-uri',

  endpoint: Config.Endpoint,
  TokenTTL: Config.TokenTTL,
  RefreshTokenTTL: Config.RefreshTokenTTL,

  useragent: 'my-user-agent',
};
