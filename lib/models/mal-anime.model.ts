import type { MalApiFields, MalApiPaginatedData, MalApiPagination } from '~/models/mal-client.model';

export const NsfwType = {
  /** This work is safe for work */
  White: 'white',
  /** This work may be not safe for work */
  Gray: 'gray',
  /** This work is not safe for work */
  Black: 'black',
} as const;

/**
 * - white:	This work is safe for work
 * - gray:	This work may be not safe for work
 * - black:	This work is not safe for work
 */
export type NsfwTypes = (typeof NsfwType)[keyof typeof NsfwType];

export type MalAnimePicture = {
  medium: string;
  large?: string;
};

export type MalAnimeAlternativeTitles = {
  synonyms: string[];
  en?: string;
  ja?: string;
};

export type MalAnimeGenre = {
  id: number;
  name: string;
};

export const MalAnimeType = {
  Unknown: 'unknown',
  TV: 'tv',
  OVA: 'ova',
  Movie: 'movie',
  Special: 'special',
  ONA: 'ona',
  Music: 'music',
} as const;

export type MalAnimeTypes = (typeof MalAnimeType)[keyof typeof MalAnimeType];

export const MalAnimeStatus = {
  FinishedAiring: 'finished_airing',
  CurrentlyAiring: 'currently_airing',
  NotYetAired: 'not_yet_aired',
} as const;

export type MalAnimeStatuses = (typeof MalAnimeStatus)[keyof typeof MalAnimeStatus];

export const MalAnimeListStatus = {
  Watching: 'watching',
  Completed: 'completed',
  OnHold: 'on_hold',
  Dropped: 'dropped',
  PlanToWatch: 'plan_to_watch',
} as const;

export type MalAnimeListStatuses = (typeof MalAnimeListStatus)[keyof typeof MalAnimeListStatus];

export type MalAnimeMyListStatus = {
  status: MalAnimeListStatuses;
  /** 0-10 */
  score: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  /** 0 or the number of watched episodes. */
  num_episodes_watched: number;
  /**
   * If authorized user watches an anime again after completion, this field value is true.
   *
   * In this case, MyAnimeList treats the anime as 'watching' in the user's anime list.
   */
  is_rewatching: boolean;
  start_date?: string;
  finish_date?: string;
  updated_at?: string;
  priority?: number;
  num_times_rewatched?: number;
  rewatch_value?: number;
  tags?: string[];
  /** You cannot contain this field in a list. */
  comments?: string;
};

export const MalAnimeSeason = {
  /** January, February, March */
  Winter: 'winter',
  /** April, May, June */
  Spring: 'spring',
  /** July, August, September */
  Summer: 'summer',
  /** October, November, December */
  Fall: 'fall',
} as const;

export type MalAnimeSeasons = (typeof MalAnimeSeason)[keyof typeof MalAnimeSeason];

export type MalAnimeSeasonStart = {
  year: number;
  season: MalAnimeSeasons;
};

export type MalAnimeBroadcast = {
  /**
   * Day of the week broadcast in Japan time.
   *
   * Day of the week or other
   */
  day_of_the_week: string;
  /** Format HH:mm */
  start_time: string;
};

export const MalAnimeSource = {
  Other: 'other',
  Original: 'original',
  Manga: 'manga',
  KomaManga: '4_koma_manga',
  WebManga: 'web_manga',
  DigitalManga: 'digital_manga',
  Novel: 'novel',
  LightNovel: 'light_novel',
  VisualNovel: 'visual_novel',
  Game: 'game',
  CardGame: 'card_game',
  Book: 'book',
  PictureBook: 'picture_book',
  Radio: 'radio',
  Music: 'music',
} as const;

export type MalAnimeSources = (typeof MalAnimeSource)[keyof typeof MalAnimeSource];

export const MalAnimeRating = {
  /** G - All Ages */
  G: 'g',
  /** PG - Children */
  PG: 'pg',
  /** pg_13 - Teens 13 and Older */
  PG13: 'pg_13',
  /** R - 17+ (violence & profanity) */
  R: 'r',
  /** R+ - Profanity & Mild Nudity */
  RPlus: 'r+',
  /** Rx - Hentai */
  Rx: 'rx',
} as const;

export type MalAnimeRatings = (typeof MalAnimeRating)[keyof typeof MalAnimeRating];

export type MalAnimeStudio = {
  id: number;
  name: string;
};

export type MalAnime = {
  id: number;
  title: string;
  main_picture?: MalAnimePicture;
  alternative_titles?: MalAnimeAlternativeTitles;
  start_date?: string;
  end_date?: string;
  /** The API strips BBCode tags from the result. */
  synopsis?: string;
  /**
   * Mean score.
   *
   * When the mean can not be calculated, such as when the number of user scores is small, the result does not include this field.
   */
  mean?: number;
  /**
   * When the rank can not be calculated, such as when the number of user scores is small, the result does not include this field
   */
  rank?: number;
  popularity?: number;
  num_list_users?: number;
  num_scoring_users?: number;
  nsfw?: NsfwTypes;
  genres?: MalAnimeGenre[];
  created_at?: string;
  updated_at?: string;
  media_type?: MalAnimeTypes;
  status?: MalAnimeStatuses;
  /** Status of user's anime list. If there is no access token, the API excludes this field. */
  my_list_status?: MalAnimeMyListStatus;
  /** The total number of episodes of this series. If unknown, it is 0. */
  num_episodes?: number;
  start_season?: MalAnimeSeasonStart;
  /** Broadcast date. */
  broadcast?: MalAnimeBroadcast;
  /** Original work. */
  source?: MalAnimeSources;
  /** Average length of episode in seconds. */
  average_episode_duration?: number;
  rating?: MalAnimeRatings;
  studios?: MalAnimeStudio[];
};

/** Default limit is 100, max is 500 */
export type MalAnimeListRequest = {
  q: string;
  nsfw?: boolean;
  fields?: MalApiFields<MalAnime>;
} & MalApiPagination;

export type MalAnimeListResponse = MalApiPaginatedData<{ node: MalAnime }>;

export const MalRelationType = {
  Sequel: 'sequel',
  Prequel: 'prequel',
  AlternativeSetting: 'alternative_setting',
  AlternativeVersion: 'alternative_version',
  SideStory: 'side_story',
  ParentStory: 'parent_story',
  Summary: 'summary',
  FullStory: 'full_story',
} as const;

export type MalRelationTypes = (typeof MalRelationType)[keyof typeof MalRelationType];

export type MalRelatedAnime = {
  node: MalAnime;
  /**
   * The type of the relationship between this work and related work
   */
  relation_type: MalRelationTypes;
  /** The format of relation_type for human like "Alternative version". */
  relation_type_formatted: string;
};

export type MalRelatedManga = {
  node: MalAnime;
  /**
   * The type of the relationship between this work and related work
   */
  relation_type: MalRelationTypes;
  /** The format of relation_type for human like "Alternative version". */
  relation_type_formatted: string;
};

export type MalAnimeRecommendation = {
  node: MalAnime;
  num_recommendations: number;
};

export type MalAnimeStatistics = {
  num_list_users: number;
  status: Record<MalAnimeListStatuses, number>;
};

export type MalAnimeDetails = MalAnime & {
  pictures?: MalAnimePicture[];
  /**
   * The API strips BBCode tags from the result.
   *
   * You cannot contain this field in a list.
   */
  background?: string;
  related_anime?: MalRelatedAnime[];
  related_manga?: MalRelatedManga[];
  recommendations?: MalAnimeRecommendation[];
  statistics?: MalAnimeStatistics;
};

export type MalAnimeDetailsRequest = {
  id: string | number;
  fields?: MalApiFields<MalAnimeDetails>;
};

export type MalAnimeRanking = {
  /** Current rank of the anime. */
  rank: number;
  /** Previous rank of the anime. */
  previous_rank?: number;
};

export const MalAnimeRankingType = {
  /** Top Anime Series */
  All: 'all',
  /** Top Airing Anime */
  Airing: 'airing',
  /** Top Upcoming Anime */
  Upcoming: 'upcoming',
  /** Top Anime TV Series */
  TV: 'tv',
  /** Top Anime OVA Series */
  OVA: 'ova',
  /** Top Anime Movies */
  Movie: 'movie',
  /** Top Anime Specials */
  Special: 'special',
  /** Top Anime by Popularity */
  ByPopularity: 'bypopularity',
  /** Top Favorited Anime */
  Favorite: 'favorite',
} as const;

export type MalAnimeRankingTypes = (typeof MalAnimeRankingType)[keyof typeof MalAnimeRankingType];

/** Default limit is 100, max is 500 */
export type MalAnimeRankingRequest = {
  ranking_type: MalAnimeRankingTypes;
  nsfw?: boolean;
  fields?: MalApiFields<MalAnime>;
} & MalApiPagination;

export type MalAnimeRankingResponse = MalApiPaginatedData<{ node: MalAnime; ranking: MalAnimeRanking }>;

export const MalAnimeSort = {
  /** In descending order of score. */
  AnimeScore: 'anime_score',
  /** In descending order of the number of list users. */
  AnimeNumListUsers: 'anime_num_list_users',
} as const;

export type MalAnimeSorts = (typeof MalAnimeSort)[keyof typeof MalAnimeSort];

/** Default limit is 100, max is 500 */
export type MalAnimeSeasonalRequest = {
  year: number;
  season: MalAnimeSeasons;
  sort?: MalAnimeSorts;
  nsfw?: boolean;
  fields?: MalApiFields<MalAnime>;
} & MalApiPagination;

export type MalAnimeSeasonalResponse = MalApiPaginatedData<{ node: MalAnime }> & { season: MalAnimeSeasonStart };

/** Default limit is 100, max is 500 */
export type MalAnimeSuggestionsRequest = {
  nsfw?: boolean;
  fields?: MalApiFields<MalAnime>;
} & MalApiPagination;

export const MalAnimeUserListSort = {
  /** Descending order of the score. */
  ListScore: 'list_score',
  /** Descending order of the updated date. */
  ListUpdatedAt: 'list_updated_at',
  /** Ascending order of anime title. */
  AnimeTitle: 'anime_title',
  /** Descending order of start date */
  AnimeStartDate: 'anime_start_date',
  /** Ascending order of anime Id */
  AnimeId: 'anime_id',
} as const;

export type MalAnimeUserListSorts = (typeof MalAnimeUserListSort)[keyof typeof MalAnimeUserListSort];

/** Default limit is 100, max is 1000 */
export type MalAnimeUserListRequest = {
  /** User name or @me. */
  user_name: string | '@me';
  status?: MalAnimeListStatuses;
  sort?: MalAnimeUserListSorts;
  nsfw?: boolean;
  fields?: MalApiFields<MalAnime>;
} & MalApiPagination;

export type MalAnimeUserListResponse = MalApiPaginatedData<{ node: MalAnime; list_status: MalAnimeMyListStatus }>;

export type MalAnimeUserListUpdateRequest = {
  anime_id: string | number;
  num_watched_episodes?: number;
} & Partial<
  Pick<
    MalAnimeMyListStatus,
    'status' | 'is_rewatching' | 'score' | 'num_episodes_watched' | 'priority' | 'num_times_rewatched' | 'rewatch_value' | 'tags' | 'comments'
  >
>;
