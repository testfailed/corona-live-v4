import { t } from "i18next";

import { boldify } from "@utils/html-util";
import { COUNTRY_NAMES } from "@constants/constants";
import { ILiveUpdatesRow } from "@components/live-updates/LiveUpdates_Row";

import { WorldUpdate } from "@features/world/world-type";

export const transformWorldLiveUpdates = (
  updates: Array<WorldUpdate>
): Array<ILiveUpdatesRow> => {
  if (Array.isArray(updates) === false) return null;

  return updates.map(({ cases, datetime, countryId }) => ({
    date: datetime,
    update: `${boldify(COUNTRY_NAMES[countryId] ?? "")} ${cases}${t(
      "stat.unit"
    )} ${t("updates.new_confirmed_cases")}`,
  }));
};
