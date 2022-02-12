//@ts-nocheck
import { boldify } from "@utils/html-util";
import { CITY_NAME_LIST } from "@constants/constants";
import { t } from "i18next";

import type { UpdateRow } from "@components/updates/Updates_Row";
import { UpdatesCategory } from "@components/updates/Updates_Categories";

import type { DomesticUpdate } from "@features/domestic/domestic-type";

export const getCityGuNameWithIds = (cityId, guId = undefined) => {
  if (cityId === undefined) return "";

  let cityName = t(`c.${cityId}`);
  let guName = t(`c.${cityId}.${guId}`);

  if (guName === `c.${cityId}.${guId}`) guName = "";

  guName = guId === "-1" ? "전체" : guName;

  return `${cityName} ${guName}`.trim();
};

export const transformDomesticUpdates = (
  updates: Array<DomesticUpdate>
): Array<UpdateRow> => {
  if (Array.isArray(updates) === false) return updates;

  return updates.map(({ cases, cityId, guId, datetime }) => ({
    date: datetime,
    update: `${boldify(getCityGuNameWithIds(cityId, guId))} ${cases}${t(
      "stat.unit"
    )} ${t("updates.new_confirmed_cases")}`,
    category: cityId,
  }));
};

export const transformDomesticUpdatesCategories = (
  updates: Array<UpdateRow>
): Array<UpdatesCategory> => {
  if (Array.isArray(updates) === false) return updates;

  const categoryCounts = {};
  updates.forEach(
    ({ category: cityId }) =>
      (categoryCounts[cityId] = (categoryCounts[cityId] ?? 0) + 1)
  );

  return CITY_NAME_LIST.map((cityName, cityId) => ({
    text: cityName,
    value: cityId,
    count: categoryCounts[cityId] ?? 0,
  })).concat({
    text: "전체",
    value: null,
    count: updates.length,
  }) as Array<UpdatesCategory>;
};
