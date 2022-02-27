import { t } from "i18next";

import { range } from "@utils/array-util";
import { getCityGuNameWithIds } from "@features/domestic/domestic-util";

const CITY_GU_IDS = [
  range(24), //서울
  range(15), //부산
  range(9), //인천
  range(7), //대구
  range(4), //광주
  range(4), //대전
  range(4), //대전
  [], //세종
  range(30), //경기
  range(17), //강운
  range(10), //충북
  range(14), //충남
  range(22), //경북
  range(17), //경남
  range(13), //전북
  range(21), //전남
  range(1), //제주
];

export const CITY_GU_NAME_LIST = CITY_GU_IDS.reduce((array, guIds, cityId) => {
  array = [...array, getCityGuNameWithIds(cityId)];
  guIds.forEach((guId) => {
    array = [...array, getCityGuNameWithIds(cityId, guId)];
  });
  return array;
}, [] as Array<string>);

export const CITY_NAME_LIST: Array<string> = CITY_GU_NAME_LIST.filter(
  (a) => a.split(" ").length === 1
);

export const EMAIL = `corona.live.kr@gmail.com`;

export const SECOND = 1000;
export const MINUTE = SECOND * 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;

export const ASSETS_URL = `https://assets.corona-live.com`;
export const API_URL = process.env.API_URL || "https://apiv3.corona-live.com";
export const WEB_URL = "https://corona-live.com";

export const TOSS_URL = `https://toss.onelink.me/3563614660?af_ad=140541&af_adset=cashtag_20210412_khj&af_dp=supertoss://cashtag/send?_minVerAos%3D5.5.0%26_minVerIos%3D5.5.0%26refId%3D186231%26word%3Dchinchilla%26webSessionKey%3D098ae253-e0cd-4f22-ae2b-f3f3f7acef11&c=conversion_cashtag_performance&id=4226c2ce-7826-4280-af67-87321e80cf8f&is_retargeting=true&pid=referral`;
export const WEBSITE_URL = `https://corona-live.com`;
export const KAKAOPAY_URL = `https://qr.kakaopay.com/281006011172839271003566`;
export const TWITTER_URL = `https://twitter.com/corona__live`;
export const INSTA_URL = `https://www.instagram.com/corona_live_official/`;
export const GITHUB_URL = `https://github.com/chinchiilla/corona-live-v4`;

export const KDCA_DATA_SOURCE = () => ({
  text: t("chart.data_source.kdca"),
  url: "https://www.kdca.go.kr",
});
