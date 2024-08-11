import { authentication } from '~/api/endpoints/authentication.endpoint';

/**
 * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2}
 */
export const malApi = {
  authentication,
};

export type MalApi = typeof malApi;
