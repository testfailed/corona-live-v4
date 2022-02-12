import { StatsLive, Stat } from "@_types/common-type";

interface CityUpdate {
  guId: number;
  cityId: number;
  cases: number;
  datetime: string;
}

export interface CityStat {
  overview: {
    confirmed: Stat;
    deceased: Stat;
    recovered: Stat;
    per100k: Stat;
  };
  gus: {
    [guId: number]: {
      cases: Stat;
      per100k: Stat;
    };
  };
}

export interface CityLive {
  live: StatsLive;
  gus: {
    [guId: number]: Stat;
  };
  updates: CityUpdate[];
}

export interface CityUpdates {
  meta: {
    checking: number;
    total: number;
    yesterday: number;
  };
  data: CityUpdate[];
}
