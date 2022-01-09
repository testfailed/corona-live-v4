export type Stat = [total: number, delta: number];

interface Timeseries {
  [hour: number]: number;
}

export interface ChartLive {
  today: Timeseries;
  yesterday: Timeseries;
  weekAgo: Timeseries;
  twoWeeksAgo: Timeseries;
  monthAgo: Timeseries;
}

export interface StatsLive {
  today: number;
  yesterday: number;
  weekAgo: number;
  twoWeeksAgo: number;
  monthAgo: number;
}

export interface Notification {
  show: boolean;
  data: { [cityId: string]: number };
  cases: number;
}

export interface Announcement {
  date: string;
  content: string;
}

export type LastUpdatedType =
  | "DOMESTIC_STAT"
  | "DOMESTIC_LIVE"
  | "DOMESTIC_TS"
  | "WORLD_STAT"
  | "WORLD_LIVE"
  | "ANNOUNCEMENT"
  | "REFRESH"
  | "NOTIFICATION";

export interface LastUpdated {
  datetime: string;
  type: LastUpdatedType;
}
