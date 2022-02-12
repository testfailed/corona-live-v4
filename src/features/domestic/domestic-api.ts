import type {
  DomesticLive,
  DomesticStat,
  DomesticUpdates,
} from "@features/domestic/domestic-type";

const DomesticApi = {
  live: {
    url: "/domestic/live",
    _t: {} as DomesticLive,
  },
  stat: {
    url: "/domestic/stat",
    _t: {} as DomesticStat,
  },
  updates: {
    url: "/domestic/updates",
    _t: {} as DomesticUpdates,
  },
};

export default DomesticApi;
