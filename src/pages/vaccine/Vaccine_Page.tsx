import React from "react";

import useApi from "@hooks/useApi";
import VaccinApi from "@apis/vaccine-api";

import Seo from "@components/Seo";
import FadeIn from "@components/FadeIn";
import Column from "@components/Column";

import VaccineSkeleton from "./Vaccine_PageSkeleton";
import VaccineInfoSection from "./sections/Vaccine_InfoSection";
import VaccineStatSection from "./sections/Vaccine_StatSection";
import VaccineChartSection from "./sections/Vaccine_ChartSection";
import VaccineRatioSection from "./sections/Vaccine_RatioSection";
import { WEB_URL } from "@constants/constants";
import { VACCINE_PATH } from "@constants/route-constants";
import LayoutFooter from "@components/layout/Layout_Footer";

const VaccinePage: React.FC = () => {
  const { data: stat } = useApi(VaccinApi.stat);
  const { data: info } = useApi(VaccinApi.info);

  return (
    <>
      <Seo
        title={`코로나 라이브 | 백신 현황`}
        description={"백신현황을 제공합니다"}
        canonical={`${WEB_URL}${VACCINE_PATH}`}
      />

      <FadeIn
        show={stat !== undefined && info !== undefined}
        fallback={<VaccineSkeleton />}
      >
        <Column>
          <VaccineStatSection />
          <VaccineRatioSection />
          <VaccineChartSection />
          <VaccineInfoSection />
          <LayoutFooter />
        </Column>
      </FadeIn>
    </>
  );
};

export default VaccinePage;