import { Stat, StatsLive } from "@_types/common-type";

export interface WorldUpdate {
  countryId: string;
  datetime: string;
  cases: number;
}

export type WorldTimeseriesType =
  | "today"
  | "yesterday"
  | "weekAgo"
  | "twoWeeksAgo"
  | "monthAgo";

export interface WorldLive {
  overview: {
    confirmed: Stat;
    deceased: Stat;
    recovered: Stat;
  };
  countries: {
    [countryId: string]: {
      confirmed: Stat;
      deceased: Stat;
      recovered: Stat;
      casesPerMil: Stat;
    };
  };
  updates: WorldUpdate[];
  hourlyLive: Record<WorldTimeseriesType, Record<string, number>>;
  live: StatsLive;
}

export interface WorldUpdates {
  updates: Array<WorldUpdate>;
}

export type WorldCountryStatsType = keyof WorldLive["countries"][number];

export type WorldTableKey = WorldCountryStatsType;
