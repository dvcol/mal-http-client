import { ValidatorUtils } from '@dvcol/base-http-client/utils/validator';
import { HttpMethod } from '@dvcol/common-utils';

import type {
  MalForumBoardsResponse,
  MalForumListTopicsRequest,
  MalForumListTopicsResponse,
  MalForumTopicDetailRequest,
  MalForumTopicDetailResponse,
} from '~/models/mal-forum.model';

import { ApiVersion, MalAuthType, MalClientEndpoint } from '~/models/mal-client.model';

export const forum = {
  /**
   * Get forum boards
   *
   * @auth client or user
   *
   * @see [forum-boards]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/forum_boards_get}
   */
  boards: new MalClientEndpoint<Record<string, never>, MalForumBoardsResponse>({
    method: HttpMethod.GET,
    url: '/forum/boards',
    opts: {
      auth: MalAuthType.Both,
      version: ApiVersion.v2,
    },
  }),
  topics: {
    /**
     * Get forum topics
     *
     * @auth client or user
     * @pagination true
     *
     * @see [forum-topics]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/forum_topics_get}
     */
    list: new MalClientEndpoint<MalForumListTopicsRequest, MalForumListTopicsResponse>({
      method: HttpMethod.GET,
      url: '/forum/topics',
      opts: {
        auth: MalAuthType.Both,
        version: ApiVersion.v2,
        pagination: {
          limit: 100,
          offset: 0,
        },
        parameters: {
          query: {
            board_id: false,
            subboard_id: false,
            sort: false,
            q: false,
            topic_user_name: false,
            user_name: false,

            limit: false,
            offset: false,
          },
        },
      },
      validate: param => {
        if (param.q) ValidatorUtils.minLength(param.q, { min: 3, name: 'q' });
        if (param.limit) ValidatorUtils.minMax(param.limit, { min: 0, max: 100, name: 'limit' });
        if (param.offset) ValidatorUtils.min(param.offset, { min: 0, name: 'offset' });
        return true;
      },
    }),
    /**
     * Get forum topic details
     *
     * @auth client or user
     * @pagination true
     *
     * @see [forum-topic-details]{@link https://myanimelist.net/apiconfig/references/api/v2#operation/forum_topic_get
     */
    details: new MalClientEndpoint<MalForumTopicDetailRequest, MalForumTopicDetailResponse>({
      method: HttpMethod.GET,
      url: '/forum/topic/:id',
      opts: {
        auth: MalAuthType.Both,
        version: ApiVersion.v2,
        pagination: {
          limit: 100,
          offset: 0,
        },
        parameters: {
          path: {
            id: true,
          },
          query: {
            limit: false,
            offset: false,
          },
        },
      },
      validate: param => {
        if (param.limit) ValidatorUtils.minMax(param.limit, { min: 0, max: 100, name: 'limit' });
        if (param.offset) ValidatorUtils.min(param.offset, { min: 0, name: 'offset' });
        return true;
      },
    }),
  },
};
