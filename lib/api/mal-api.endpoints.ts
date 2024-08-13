import { anime } from '~/api/endpoints/anime.endpoint';
import { authentication } from '~/api/endpoints/authentication.endpoint';
import { forum } from '~/api/endpoints/forum.endpoint';
import { manga } from '~/api/endpoints/manga.endpoint';
import { user } from '~/api/endpoints/user.endpoint';

/**
 * @see [documentation]{@link https://myanimelist.net/apiconfig/references/api/v2}
 */
export const malApi = {
  authentication,
  anime,
  manga,
  user,
  forum,
};

export type MalApi = typeof malApi;
