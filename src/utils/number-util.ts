import { t } from "i18next";

export const numberWithCommas = (number?: number) => {
  if (number === undefined) return;
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const numberSign = (number): "+" | "-" | "" => {
  if (!number) return "";
  let sign = Math.sign(number);
  switch (sign) {
    case 1:
      return "+";
    case -1:
      return "-";
    case 0:
    default:
      return "";
  }
};

export const THOUSAND = 1000;
export const GRAND = 10000;
export const MILLION = 1000000;

export const koreanNumberFormat = (number: number) => {
  if (!number) return "";
  let unit = "";
  let value = number;

  const isEnglish = t("language") === "en";

  if (number > MILLION) {
    value = number / MILLION;
    unit = isEnglish ? "m" : "백만";
  } else if (number > GRAND) {
    value = number / GRAND;
    unit = isEnglish ? "0k" : "만";
  } else if (number > THOUSAND) {
    value = number / THOUSAND;
    unit = isEnglish ? "k" : "천";
  }

  if (value === 0) return "";

  return `${numberWithCommas(Number(value.toFixed(2)))}${unit}`;
};
