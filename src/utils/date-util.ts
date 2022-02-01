import { darkTheme } from "@styles/themes/dark-theme";
import dayjs from "dayjs";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const getDateDistance = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffTime = Math.abs(now.getTime() - past.getTime());

  if (diffTime < MINUTE) {
    return `${Math.floor(diffTime / SECOND)}초 전`;
  } else if (diffTime < HOUR) {
    return `${Math.floor(diffTime / MINUTE)}분 전`;
  } else if (diffTime < DAY) {
    return `${Math.floor(diffTime / HOUR)}시간 전`;
  } else {
    return `${Math.floor(diffTime / DAY)}일 전`;
  }
};

let getDaysInMonthCache = {};

export const getDaysInMonth = (year: number, month: number, day?: number) => {
  const cacheId = `${year}/${month}/${day ?? 0}`;
  if (cacheId in getDaysInMonthCache) {
    return getDaysInMonthCache[cacheId];
  } else {
    const daysInMonth = new Date(year, month, day ?? 0).getDate();
    getDaysInMonthCache[cacheId] = daysInMonth;

    return daysInMonth;
  }
};

export const addZero = (value: number) => {
  return `${value > 9 ? "" : "0"}${value}`;
};

export const isInTimeRange = (timeA, timeB) => {
  let date = new Date();
  let now = `${addZero(date.getHours())}:${addZero(
    date.getMinutes()
  )}:${addZero(date.getSeconds())}`;
  return timeA < now && timeB > now;
};

export const generateDatesBetweenTwoDates = (from: string, to: string) => {
  let dates = [];

  let currentDate = dayjs(from);
  let stopDate = dayjs(to);
  while (currentDate < stopDate) {
    dates.push(currentDate.toISOString().slice(0, 10));
    currentDate = dayjs(currentDate).add(1, "day");
  }

  return dates;
};
