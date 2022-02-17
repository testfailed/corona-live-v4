import React from "react";

import Column from "@components/Column";
import { VaccineInfoSectionSkeleton } from "@features/vaccine/components/sections/Vaccine_InfoSection";
import { VaccineStatSectionSkeleton } from "@features/vaccine/components/sections/Vaccine_StatSection";
import { VaccineChartSectionSkeleton } from "@features/vaccine/components/sections/Vaccine_ChartSection";
import { VaccineRatesSectionSkeleton } from "@features/vaccine/components/sections/Vaccine_RatesSection";

const VaccinePageSkeleton: React.FC = () => {
  return (
    <Column>
      <VaccineStatSectionSkeleton />
      <VaccineRatesSectionSkeleton />
      <VaccineChartSectionSkeleton />
      <VaccineInfoSectionSkeleton />
    </Column>
  );
};

export default VaccinePageSkeleton;
