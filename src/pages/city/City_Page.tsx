import React, { useMemo } from "react";

import { useParams } from "react-router-dom";

import useApi from "@hooks/useApi";
import { WEB_URL } from "@constants/constants";
import { useScrollTop } from "@hooks/useScrollTop";
import { CITY_PATH } from "@constants/route-constants";

import Seo from "@components/Seo";
import FadeIn from "@components/FadeIn";
import Column from "@components/Column";

import CitySkelton from "./City_PageSkeleton";
import { CityStatSection } from "@features/city/components/City_StatSection";
import { CityLiveSection } from "@features/city/components/City_LiveSection";
import { CityTitleSection } from "@features/city/components/City_TitleSection";
import { CityChartSection } from "@features/city/components/City_ChartSection";
import { CityTableSection } from "@features/city/components/City_TableSection";

import CityApi from "@features/city/city-api";
import { getCityGuNameWithIds } from "@features/domestic/domestic-util";

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
        </Column>
      </FadeIn>
    </>
  );
};

export default CityPage;
