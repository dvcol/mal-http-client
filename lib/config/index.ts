import { ApiVersion } from '~/models/mal-client.model';

export const Config = {
  endpoint: 'https://api.myanimelist.net',
  version: ApiVersion,
} as const;
