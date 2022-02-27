import { StatsLive, Stat } from "@_types/common-type";

export interface DomesticUpdate {
  guId: number;
  cityId: number;
  cases: number;
  datetime: string;
}

export interface DomesticStat {
  overview: {
    confirmed: Stat;
    confirmedCritical: Stat;
    deceased: Stat;
    hospitalised: Stat;
  };
  cities: {
    [cityId: string]: {
      confirmed: Stat;
      deceased: Stat;
      per100k: [number, number] | number[];
    };
  };
}
export type DomesticStatsType = keyof DomesticStat["overview"];
export type DomesticCityStatsType = keyof DomesticStat["cities"][number];

export type DomesticTableKey = DomesticCityStatsType | "casesLive";

export type DomestictTimeseriesType =
  | "today"
  | "yesterday"
  | "weekAgo"
  | "twoWeeksAgo"
  | "monthAgo";

export interface DomesticLive {
  cities: {
    [cityId: string]: Stat;
  };
  updates: DomesticUpdate[];
  updatesPreview: DomesticUpdate[];
  live: StatsLive;
  hourlyLive: Record<DomestictTimeseriesType, Record<string, number>>;
}

export type DomesticLiveType = keyof DomesticLive["live"];

export interface DomesticUpdates {
  updates: DomesticUpdate[];
}

export interface DomesticRow {
  cases: Stat;
  casesLive: Stat;
  deaths: Stat;
  recovered: Stat;
  per100k: Stat;
  distanceLevel: Stat;
}

export interface CitiesStat {
  [cityId: string]: Stat;
}
