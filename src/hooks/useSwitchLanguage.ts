import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

export const useSwitchLanguage = () => {
  const { t, i18n } = useTranslation();

  const switchLanguage = () => {
    const locale = i18n.resolvedLanguage === "en" ? "ko" : "en";
    dayjs.locale(locale);
    i18n.changeLanguage(locale);
  };

  return switchLanguage;
};
