import type { MalApiFields, MalApiPaginatedData, MalApiPagination } from '~/models/mal-client.model';

import type { MalBaseEntity, MalPicture, MalRanking, MalRecommendation, MalRelatedEntity } from '~/models/mal-common.model';

export const MalMangaType = {
  Unknown: 'unknown',
  Manga: 'manga',
  Novel: 'novel',
  OneShot: 'one_shot',
  Doujin: 'doujin',
  Manhwa: 'manhwa',
  Manhua: 'manhua',
  OEL: 'oel',
} as const;

export type MalMangaTypes = (typeof MalMangaType)[keyof typeof MalMangaType];

export const MalMangaStatus = {
  Finished: 'finished',
  CurrentlyPublishing: 'currently_publishing',
  NotYetPublished: 'not_yet_published',
} as const;

export type MalMangaStatuses = (typeof MalMangaStatus)[keyof typeof MalMangaStatus];

export const MalMangaListStatus = {
  Reading: 'reading',
  Completed: 'completed',
  OnHold: 'on_hold',
  Dropped: 'dropped',
  PlanToRead: 'plan_to_read',
} as const;

export type MalMangaListStatuses = (typeof MalMangaListStatus)[keyof typeof MalMangaListStatus];

export type MalMangaMyListStatus = {
  status: MalMangaListStatuses;
  /** 0-10 */
  score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  /** 0 or the number of read volumes. */
  num_volumes_read: number;
  /**  0 or the number of read chapters. */
  num_chapters_read: number;
  /**
   * If authorized user reads an manga again after completion, this field value is true.
   *
   * In this case, MyAnimeList treats the manga as 'reading' in the user's manga list.
   */
  is_rereading: boolean;
  start_date?: string;
  finish_date?: string;
  priority?: number;
  num_times_reread?: number;
  reread_value?: number;
  tags?: string[];
  /** You cannot contain this field in a list. */
  comments?: string;
  updated_at?: string;
};

export type MalMangaAuthor = {
  id: number;
  first_name: string;
  last_name: string;
};

export type MalMangaAuthorRole = {
  node: MalMangaAuthor;
  role: string;
};

export type MalManga = MalBaseEntity<{
  media_type?: MalMangaTypes;
  status?: MalMangaStatuses;
  /**
   * Status of user's manga list. If there is no access token, the API excludes this field.
   */
  my_list_status?: MalMangaMyListStatus;
  /** If unknown, it is 0. */
  num_volumes?: number;
  /** If unknown, it is 0. */
  num_chapters?: number;
  authors?: MalMangaAuthorRole[];
}>;

/** Default limit is 100, max is 500 */
export type MalMangaListRequest = {
  q: string;
  nsfw?: boolean;
  fields?: MalApiFields<MalManga>;
} & MalApiPagination;

export type MalMangaListResponse = MalApiPaginatedData<{ node: MalManga }>;

export type MalMagazine = {
  id: number;
  name: string;
};

export type MalMangaSerialization = {
  node: MalMagazine;
  role: string;
};

export type MalMangaDetails = MalManga & {
  /** You cannot contain this field in a list. */
  pictures?: MalPicture[];
  /**
   * The API strips BBCode tags from the result.
   *
   * You cannot contain this field in a list.
   */
  background?: string;
  /** You cannot contain this field in a list. */
  related_mange?: MalRelatedEntity<MalManga>[];
  /**
   * Summary of recommended anime for those who like this manga.
   *
   * You cannot contain this field in a list.
   */
  recommendations?: MalRecommendation<MalManga>[];
  /** You cannot contain this field in a list. */
  serialization?: MalMangaSerialization[];
};

export type MalMangaDetailsRequest = {
  id: string | number;
  fields?: MalApiFields<MalMangaDetails>;
};

export const MalMangaRankingType = {
  /** All */
  All: 'all',
  /** Top Manga */
  Manga: 'manga',
  /** Top Novels */
  Novels: 'novels',
  /** Top One-shots */
  OneShots: 'oneshots',
  /** Top Doujinshi */
  Doujin: 'doujin',
  /** Top Manhwa */
  Manhwa: 'manhwa',
  /** Top Manhua */
  Manhua: 'manhua',
  /** Most Popular */
  ByPopularity: 'bypopularity',
  /** Most Favorited */
  Favorite: 'favorite',
} as const;

export type MalMangaRankingTypes = (typeof MalMangaRankingType)[keyof typeof MalMangaRankingType];

export type MalMangaRankingRequest = {
  ranking_type?: MalMangaRankingTypes;
  nsfw?: boolean;
  fields?: MalApiFields<MalManga>;
} & MalApiPagination;

export type MalMangaRankingResponse = MalApiPaginatedData<{ node: MalManga; ranking: MalRanking }>;

export const MalMangaListSort = {
  /** Descending order of the score. */
  ListScore: 'list_score',
  /** Descending order of the updated date. */
  ListUpdatedAt: 'list_updated_at',
  /** Ascending order of manga title. */
  MangaTitle: 'manga_title',
  /** Descending order of start date */
  MangaStartDate: 'manga_start_date',
  /** Ascending order of anime Id */
  MangaId: 'manga_id',
} as const;

export type MalMangaListSorts = (typeof MalMangaListSort)[keyof typeof MalMangaListSort];

/** Default limit is 100, max is 1000 */
export type MalMangaUserListRequest = {
  /** User name or @me. */
  user_name: string | '@me';
  status?: MalMangaListStatuses;
  sort?: MalMangaListSorts;
  nsfw?: boolean;
  fields?: MalApiFields<MalManga>;
} & MalApiPagination;

export type MalMangaUserListResponse = MalApiPaginatedData<{ node: MalManga; list_status: MalMangaMyListStatus }>;

export type MalMangaUserListUpdateRequest = {
  manga_id: string | number;
  num_watched_episodes?: number;
} & Partial<
  Pick<
    MalMangaMyListStatus,
    | 'status'
    | 'is_rereading'
    | 'score'
    | 'num_volumes_read'
    | 'num_chapters_read'
    | 'priority'
    | 'num_times_reread'
    | 'reread_value'
    | 'tags'
    | 'comments'
  >
>;
