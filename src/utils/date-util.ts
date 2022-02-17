import _dayjs, { Dayjs } from "dayjs";

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const dayjs = (date?: string | number | Date | Dayjs): Dayjs => {
  return _dayjs().tz("Asia/Seoul");
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
