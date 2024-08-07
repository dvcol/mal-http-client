import type { IMalApi, MalClientOptions } from '~/models/mal-client.model';

import { minimalMalApi } from '~/api/mal-minimal-api.endpoints';
import { BaseMalClient } from '~/clients/base-mal-client';
import { type IMalClientAuthentication } from '~/models/mal-authentication.model';

/**
 * MalClient is a wrapper around the MalApi to provide basic authentication and state management.
 *
 * @class MalClient
 *
 * @extends {BaseMalClient}
 */
export class MalClient extends BaseMalClient {
  /**
   * Creates an instance of MalClient, with the necessary endpoints and settings.
   * @param settings - The settings for the client.
   * @param authentication - The authentication for the client.
   * @param api - The API endpoints for the client.
   */
  constructor(settings: MalClientOptions, authentication: IMalClientAuthentication = {}, api: IMalApi = minimalMalApi) {
    super(settings, authentication, api);
  }
}
