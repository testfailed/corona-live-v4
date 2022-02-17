import React from "react";

import useApi from "@hooks/useApi";
import { WEB_URL } from "@constants/constants";

import Seo from "@components/Seo";
import FadeIn from "@components/FadeIn";
import Column from "@components/Column";

import DomesticSkeleton from "./Domestic_PageSkeleton";
import { DomesticStatSection } from "@features/domestic/components/sections/Domestic_StatSection";
import { DomesticLiveSection } from "@features/domestic/components/sections/Domestic_LiveSection";
import { DomesticChartSection } from "@features/domestic/components/sections/Domestic_ChartSection";
import { DomesticCitySection } from "@features/domestic/components/sections/Domestic_CitySection";

import DomesticApi from "@features/domestic/domestic-api";

const DomesticPage: React.FC = () => {
  const { data: live } = useApi(DomesticApi.live);
  const { data: stat } = useApi(DomesticApi.stat);

  return (
    <>
      <Seo
        title={`코로나 라이브 | 실시간 확진자 현황`}
        description={
          "국내/세계 코로나 확진자수를 실시간으로 집계하여 제공합니다"
        }
        canonical={WEB_URL}
      />
      <FadeIn
        show={live !== undefined && stat !== undefined}
        fallback={<DomesticSkeleton />}
      >
        <Column>
          <DomesticStatSection />
          <DomesticLiveSection />
          <DomesticChartSection />
          <DomesticCitySection />
        </Column>
      </FadeIn>
    </>
  );
};

export default DomesticPage;
