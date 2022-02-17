import React from "react";

import useApi from "@hooks/useApi";
import VaccinApi from "@features/vaccine/vaccine-api";

import { WEB_URL } from "@constants/constants";
import { VACCINE_PATH } from "@constants/route-constants";

import Seo from "@components/Seo";
import Column from "@components/Column";
import FadeIn from "@components/FadeIn";

import VaccineSkeleton from "./Vaccine_PageSkeleton";
import { VaccineStatSection } from "@features/vaccine/components/sections/Vaccine_StatSection";
import { VaccineInfoSection } from "@features/vaccine/components/sections/Vaccine_InfoSection";
import { VaccineChartSection } from "@features/vaccine/components/sections/Vaccine_ChartSection";
import { VaccineRatesSection } from "@features/vaccine/components/sections/Vaccine_RatesSection";

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
          <VaccineRatesSection />
          <VaccineChartSection />
          <VaccineInfoSection />
        </Column>
      </FadeIn>
    </>
  );
};

export default VaccinePage;
