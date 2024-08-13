import type { MalApiFields } from '~/models/mal-client.model';

export type MalUserAnimeStatistics = {
  num_items_watching: number;
  num_items_completed: number;
  num_items_on_hold: number;
  num_items_dropped: number;
  num_items_plan_to_watch: number;
  num_items: number;
  num_days_watched: number;
  num_days_watching: number;
  num_days_completed: number;
  num_days_on_hold: number;
  num_days_dropped: number;
  /** Total days watched: num_watching_days + num_completed_days + num_on_hold_days + num_dropped_days */
  num_days: number;
  num_episodes: number;
  num_times_rewatched: number;
  mean_score: number;
};

export type MalUser = {
  id: number;
  name: string;
  picture?: string;
  gender?: string;
  birthday?: string;
  location?: string;
  joined_at: string;
  time_zone?: string;
  is_supporter?: boolean;
  anime_statistics?: MalUserAnimeStatistics;
};

export type MalUserRequest = {
  /** You can only specify @me. */
  id: '@me' | string;
  fields: MalApiFields<MalUser>;
};
