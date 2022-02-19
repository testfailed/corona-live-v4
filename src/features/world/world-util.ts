import { t } from "i18next";

import { boldify } from "@utils/html-util";
import { ILiveUpdatesRow } from "@components/live-updates/LiveUpdates_Row";

import { WorldUpdate } from "@features/world/world-type";
import { numberWithCommas } from "@utils/number-util";

export const transformWorldLiveUpdates = (
  updates: Array<WorldUpdate>
): Array<ILiveUpdatesRow> => {
  if (Array.isArray(updates) === false) return null;

  return updates.map(({ cases, datetime, countryId }) => ({
    date: datetime,
    update: `${boldify(
      t(countryId) === countryId ? "" : t(countryId)
    )} ${numberWithCommas(cases)}${t("stat.unit")} ${t(
      "updates.new_confirmed_cases"
    )}`,
  }));
};
