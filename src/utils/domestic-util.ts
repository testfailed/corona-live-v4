//@ts-nocheck
import { boldify } from "@utils/html-util";
import { CITY_GU_NAMES, CITY_NAME_LIST } from "@constants/constants";

import type { UpdateRow } from "@components/updates/Updates_Row";
import { UpdatesCategory } from "@components/updates/Updates_Categories";

import type { DomesticUpdate } from "@features/domestic/domestic-type";

export const getCityGuNameWithIds = (cityId, guId = undefined) => {
  if (cityId === undefined) return "";

  let cityName = CITY_GU_NAMES[`${cityId}`] || "";
  let guName = CITY_GU_NAMES[`${cityId}/${guId}`] || "";

  guName = guId === "-1" ? "전체" : guName;

  return `${cityName} ${guName}`.trim();
};

export const transformDomesticUpdates = (
  updates: Array<DomesticUpdate>
): Array<UpdateRow> => {
  if (Array.isArray(updates) === false) return updates;

  return updates.map(({ cases, cityId, guId, datetime }) => ({
    date: datetime,
    update: `${boldify(
      getCityGuNameWithIds(cityId, guId)
    )} ${cases}명 추가 확진`,
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
