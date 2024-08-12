import type { MalAnimeFields, MalApiPagination } from '~/models/mal-client.model';

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

export type MalAnimeMainPicture = {
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
  start_date: string;
  finish_date: string;
  priority: number;
  num_times_rewatched: number;
  rewatch_value: number;
  tags: string[];
  /** You cannot contain this field in a list. */
  comments?: string;
  updated_at: string;
};

export const MalAnimeSeason = {
  Winter: 'winter',
  Spring: 'spring',
  Summer: 'summer',
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
  main_picture?: MalAnimeMainPicture;
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

export type MalAnimeListRequest = {
  q: string;
  fields?: MalAnimeFields<MalAnime>;
  nsfw?: boolean;
} & MalApiPagination;
