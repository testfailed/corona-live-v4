import React from "react";

import Column from "@components/Column";
import { VaccineInfoSkeleton } from "../../features/vaccine/components/sections/Vaccine_InfoSection";
import { VaccineStatSkeleton } from "../../features/vaccine/components/sections/Vaccine_StatSection";
import { VaccineChartSectionSkeleton } from "../../features/vaccine/components/sections/Vaccine_ChartSection";
import { VaccineRatesSectionSkeleton } from "../../features/vaccine/components/sections/Vaccine_RatesSection";

const VaccinePageSkeleton: React.FC = (props) => {
  return (
    <Column>
      <VaccineStatSkeleton />
      <VaccineRatesSectionSkeleton />
      <VaccineChartSectionSkeleton />
      <VaccineInfoSkeleton />
    </Column>
  );
};

export default VaccinePageSkeleton;
