import type { MalApiPaginatedData, MalApiPagination } from '~/models/mal-client.model';

export type MalForumSubBoard = {
  id: number;
  title: string;
};

export type MalForumBoard = {
  id: number;
  title: string;
  description: string;
  subboards: MalForumSubBoard[];
};

export type MalForumCategory = {
  title: string;
  boards: MalForumBoard[];
};

export type MalForumBoardsResponse = {
  categories: MalForumCategory[];
};

export type MalForumCreatedBy = {
  id: number;
  name: string;
};

export type MalForumTopic = {
  id: number;
  title: string;
  created_at: string;
  created_by: MalForumCreatedBy;
  number_of_posts: number;
  last_post_created_at: string;
  last_post_created_by: MalForumCreatedBy;
  is_locked: boolean;
};

export type MalForumListTopicsRequest = {
  board_id?: number;
  subboard_id?: number;
  /** Currently, only "recent" can be set. */
  sort?: 'recent' | string;
  q?: string;
  topic_user_name?: string;
  user_name?: string;
} & MalApiPagination;

export type MalForumListTopicsResponse = MalApiPaginatedData<MalForumTopic>;

export type MalForumPostCreatedBy = MalForumCreatedBy & {
  forum_avatar: string;
};

export type MalForumPost = {
  id: number;
  number: number;
  created_at: string;
  created_by: MalForumPostCreatedBy;
  body: string;
  signature: string;
};

export type MalForumPollOption = {
  id: number;
  text: string;
  votes: number;
};

export type MalForumPoll = {
  id: number;
  question: string;
  close: boolean;
  options: MalForumPollOption[];
};

export type MalForumTopicDetail = {
  title: string;
  posts: MalForumPost[];
  poll?: MalForumPoll[];
};

export type MalForumTopicDetailRequest = {
  id: number;
} & MalApiPagination;

export type MalForumTopicDetailResponse = MalApiPaginatedData<MalForumTopicDetail>;
