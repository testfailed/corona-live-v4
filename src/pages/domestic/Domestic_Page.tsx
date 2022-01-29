import React from "react";

import useApi from "@hooks/useApi";
import DomesticApi from "@apis/domestic-api";
import { WEB_URL } from "@constants/constants";

import DomesticSkeleton from "./Domestic_PageSkeleton";
import DomesticLiveSection from "./sections/Domestic_LiveSection";
import DomesticStatSection from "./sections/Domestic_StatSection";
import DomesticCitySection from "./sections/Domestic_CitySection";
import DomesticChartSection from "./sections/Domestic_ChartSection";

import Seo from "@components/Seo";
import FadeIn from "@components/FadeIn";
import Column from "@components/Column";
import LayoutFooter from "@components/layout/Layout_Footer";

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
          <DomesticSkeleton />
          <DomesticStatSection />
          <DomesticLiveSection />
          <DomesticChartSection />
          <DomesticCitySection />
          <LayoutFooter />
        </Column>
      </FadeIn>
    </>
  );
};

export default DomesticPage;
