import type { MalAnime } from '~/models/mal-anime.model';
import type { MalManga } from '~/models/mal-manga.model';

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

export type MalPicture = {
  medium: string;
  large?: string;
};

export type MalAlternativeTitles = {
  synonyms: string[];
  en?: string;
  ja?: string;
};

export const MalAnimeListStatus = {
  Watching: 'watching',
  Completed: 'completed',
  OnHold: 'on_hold',
  Dropped: 'dropped',
  PlanToWatch: 'plan_to_watch',
} as const;

export type MalAnimeListStatuses = (typeof MalAnimeListStatus)[keyof typeof MalAnimeListStatus];

export type MalGenre = {
  id: number;
  name: string;
};

export type MalBaseEntity<T> = {
  id: number;
  title: string;
  main_picture?: MalPicture;
  alternative_titles?: MalAlternativeTitles;
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
  genres?: MalGenre[];
  created_at?: string;
  updated_at?: string;
} & T;

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

export type MalRelatedEntity<T extends MalAnime | MalManga> = {
  node: T;
  /**
   * The type of the relationship between this work and related work
   */
  relation_type: MalRelationTypes;
  /** The format of relation_type for human like "Alternative version". */
  relation_type_formatted: string;
};

export type MalRecommendation<T extends MalAnime | MalManga> = {
  node: T;
  num_recommendations: number;
};

export type MalRanking = {
  /** Current rank of the anime. */
  rank: number;
  /** Previous rank of the anime. */
  previous_rank?: number;
};
