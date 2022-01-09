import React, { useMemo } from "react";

import { useParams } from "react-router-dom";

import useApi from "@hooks/useApi";
import CityApi from "@apis/city-api";
import { WEB_URL } from "@constants/constants";
import { useScrollTop } from "@hooks/useScrollTop";
import { CITY_PATH } from "@constants/route-constants";
import { getCityGuNameWithIds } from "@utils/domestic-util";

import Seo from "@components/Seo";
import FadeIn from "@components/FadeIn";
import Column from "@components/Column";

import CitySkelton from "./City_PageSkeleton";
import CityLiveSection from "./sections/City_LiveSection";
import CityStatSection from "./sections/City_StatSection";
import CityChartSection from "./sections/City_ChartSection";
import CityTableSection from "./sections/City_TableSection";
import CityTitleSection from "./sections/City_TitleSection";
import LayoutFooter from "@components/layout/Layout_Footer";

const CityPage: React.FC = () => {
  useScrollTop();
  const params = useParams<{ cityId: string }>();

  const { data: live } = useApi(CityApi.live(params.cityId));
  const { data: stat } = useApi(CityApi.stat(params.cityId));

  const cityName = useMemo(() => getCityGuNameWithIds(params.cityId), [params]);

  return (
    <>
      <Seo
        title={`코로나 라이브 | ${cityName}`}
        description={`${cityName}에서 발생한 당일 확진자를 실시간으로 제공합니다`}
        canonical={`${WEB_URL}${CITY_PATH}/${params.cityId}`}
      />

      <FadeIn
        show={live !== undefined && stat !== undefined}
        fallback={<CitySkelton />}
      >
        <Column>
          <CityTitleSection />
          <CityStatSection />
          <CityLiveSection />
          <CityChartSection />
          <CityTableSection />
          <LayoutFooter />
        </Column>
      </FadeIn>
    </>
  );
};

export default CityPage;
