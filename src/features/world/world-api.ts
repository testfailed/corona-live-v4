import type { WorldLive, WorldUpdates } from "@features/world/world-type";

const WorldApi = {
  live: {
    url: "/world/live",
    _t: {} as WorldLive,
  },

  updates: {
    url: "/world/updates",
    _t: {} as WorldUpdates,
  },
};

export default WorldApi;
