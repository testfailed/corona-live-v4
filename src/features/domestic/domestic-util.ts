//@ts-nocheck
import { t } from "i18next";

import { boldify } from "@utils/html-util";
import { numberWithCommas } from "@utils/number-util";
import { CITY_NAME_LIST } from "@constants/constants";

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

export const getSimplifiedCityGuNameWithIds = (cityId, guId = undefined) => {
  if (cityId === undefined) return "";

  let cityName = t(`c.${cityId}`);
  let guName = t(`c.${cityId}.${guId}`);

  if (guName === `c.${cityId}.${guId}`) {
    return cityName;
  } else {
    return guName;
  }
};

export const transformDomesticUpdates = (
  updates: Array<DomesticUpdate>
): Array<UpdateRow> => {
  if (Array.isArray(updates) === false) return updates;

  const isEnglish = t("language") === "en";

  return updates.map(({ cases, cityId, guId, datetime }) => ({
    date: datetime,
    update: `${boldify(
      isEnglish
        ? getSimplifiedCityGuNameWithIds(cityId, guId)
        : getCityGuNameWithIds(cityId, guId)
    )}${numberWithCommas(cases)}${t("stat.unit")} ${t(
      "updates.new_confirmed_cases"
    )}`,
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

  return CITY_NAME_LIST.filter((name) => name !== "검역")
    .map((_, cityId) => ({
      text: getCityGuNameWithIds(cityId),
      value: cityId,
      count: categoryCounts[cityId] ?? 0,
    }))
    .concat({
      text: t("all"),
      value: null,
      count: updates.length,
    }) as Array<UpdatesCategory>;
};
