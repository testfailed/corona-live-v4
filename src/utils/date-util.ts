import _dayjs, { Dayjs } from "dayjs";

import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { t } from "i18next";

_dayjs.extend(utc);
_dayjs.extend(timezone);

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

const SEOUL_UTC_OFFSET = 9;

export const dayjs = (date?: string | number | Date | Dayjs): Dayjs => {
  return _dayjs(date).tz("Asia/Seoul");
};

export const fromNow = (date: string) => {
  const diff = dayjs().diff(
    _dayjs.utc(date).subtract(SEOUL_UTC_OFFSET, "h"),
    "millisecond"
  );

  if (diff < MINUTE) {
    return `${Math.floor(diff / SECOND)}${t("date.s")} ${t("date.ago")}`;
  } else if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}${t("date.m")} ${t("date.ago")}`;
  } else if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}${t("date.h")} ${t("date.ago")}`;
  } else {
    return `${Math.floor(diff / DAY)}${t("date.d")} ${t("date.ago")}`;
  }
};

let getDaysInMonthCache = {};

export const getDaysInMonth = (year: number, month: number, day?: number) => {
  const cacheId = `${year}/${month}/${day ?? 0}`;
  if (cacheId in getDaysInMonthCache) {
    return getDaysInMonthCache[cacheId];
  } else {
    const daysInMonth = dayjs(`${year}-${month}-${day ?? 0}`).daysInMonth();
    getDaysInMonthCache[cacheId] = daysInMonth;

    return daysInMonth;
  }
};

export const addZero = (value: number) => {
  return `${value > 9 ? "" : "0"}${value}`;
};

export const isInTimeRange = (timeA: string, timeB: string): boolean => {
  const now = dayjs().format("HH:mm:ss");
  return timeA < now && timeB > now;
};

export const isNotInTimeRange = (timeA: string, timeB: string): boolean => {
  return !isInTimeRange(timeA, timeB);
};

export const generateDatesBetweenTwoDates = (from: string, to: string) => {
  let dates = [];

  let currentDate = dayjs(from);
  let stopDate = dayjs(to);

  while (currentDate <= stopDate) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate = dayjs(currentDate).add(1, "day");
  }

  return dates;
};
