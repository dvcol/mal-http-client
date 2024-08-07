import type { MalClientSettings } from '~/models/mal-client.model';

import { Config } from '~/config';

export const malClientSettings: MalClientSettings = {
  endpoint: Config.endpoint,

  client_id: 'my-client-id',
  client_secret: 'my-client-secret',

  redirect_uri: 'my-redirect-uri',

  useragent: 'my-user-agent',
};
