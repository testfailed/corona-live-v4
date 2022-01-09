import type {
  Announcement,
  Notification,
  LastUpdated,
} from "@_types/common-type";

const CommonApi = {
  notification: {
    url: "/notification",
    _t: {} as Notification,
  },
  announcement: {
    url: "/announcement",
    _t: {} as Announcement,
  },
  lastUpdated: {
    url: "/last-updated",
    _t: {} as LastUpdated,
  },
};

export default CommonApi;
