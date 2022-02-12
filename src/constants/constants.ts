import { t } from "i18next";
import CITY_GU_NAMES from "./json/city-gu-names.json";
import COUNTRY_NAMES from "./json/country-names.json";

export const CITY_GU_NAME_LIST = Object.keys(CITY_GU_NAMES).map((id) => {
  let [cityId, guId] = id.split("/");
  if (!guId) return CITY_GU_NAMES[cityId];
  return `${CITY_GU_NAMES[cityId]} ${CITY_GU_NAMES[id]}`;
});

export const CITY_NAME_LIST: Array<string> = CITY_GU_NAME_LIST.filter(
  (a) => a.split(" ").length === 1
);

export const EMAIL = `corona.live.kr@gmail.com`;

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const ASSETS_URL = `https://assets.corona-live.com`;
export const API_URL = process.env.API_URL;
export const WEB_URL = "https://corona-live.com";

export const TOSS_URL = `https://toss.onelink.me/3563614660?af_ad=140541&af_adset=cashtag_20210412_khj&af_dp=supertoss://cashtag/send?_minVerAos%3D5.5.0%26_minVerIos%3D5.5.0%26refId%3D186231%26word%3Dchinchilla%26webSessionKey%3D098ae253-e0cd-4f22-ae2b-f3f3f7acef11&c=conversion_cashtag_performance&id=4226c2ce-7826-4280-af67-87321e80cf8f&is_retargeting=true&pid=referral`;
export const WEBSITE_URL = `https://corona-live.com`;
export const FACEBOOK_URL = `https://www.facebook.com/sharer/sharer.php?u=${WEBSITE_URL}%2F&amp;src=sdkpreparse`;
export const BLOG_URL = `http://blog.naver.com/openapi/share?url=${WEBSITE_URL}&title=[코로나 라이브] 코로나 현황 실시간으로 보기`;
export const TWITTER_URL = `http://twitter.com/share?url=${WEBSITE_URL}&text=코로나 현황 실시간으로 보기`;
export const KAKAOPAY_URL = `https://qr.kakaopay.com/281006011172839271003566`;
export const TWITTER_SNS_URL = `https://twitter.com/corona__live`;
export const INSTA_SNS_URL = `https://www.instagram.com/corona_live_official/`;

export const KDCA_DATA_SOURCE = () => ({
  text: t("data_source.kdca"),
  url: "https://www.kdca.go.kr",
});

export { CITY_GU_NAMES, COUNTRY_NAMES };
