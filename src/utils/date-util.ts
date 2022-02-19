import _dayjs, { Dayjs } from "dayjs";

import "dayjs/locale/ko";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";

_dayjs.extend(utc);
_dayjs.extend(timezone);
_dayjs.tz.setDefault("Asia/Seoul");

_dayjs.extend(relativeTime);
_dayjs.extend(updateLocale);

_dayjs.updateLocale("en", {
  relativeTime: {
    past: "%s ago",
    s: "%ds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
  },
});

_dayjs.updateLocale("ko", {
  relativeTime: {
    past: "%s 전",
    s: "%d초",
    m: "1분",
    mm: "%d분",
    h: "1시간",
    hh: "%d시간",
  },
});

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const dayjs = (date?: string | number | Date | Dayjs): Dayjs => {
  return _dayjs(date).tz("Asia/Seoul");
};

export const getDateDistance = (date: string) => {
  const now = dayjs();
  const past = dayjs(date);
  const diff = now.diff(past, "millisecond");

  if (diff < MINUTE) {
    return `${Math.floor(diff / SECOND)}초 전`;
  } else if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}분 전`;
  } else if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}시간 전`;
  } else {
    return `${Math.floor(diff / DAY)}일 전`;
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
