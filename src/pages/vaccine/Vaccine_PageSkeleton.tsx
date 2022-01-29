import React from "react";

import Column from "@components/Column";
import { VaccineInfoSkeleton } from "./sections/Vaccine_InfoSection";
import { VaccineStatSkeleton } from "./sections/Vaccine_StatSection";
import { VaccineChartSectionSkeleton } from "./sections/Vaccine_ChartSection";
import { VaccineRatesSectionSkeleton } from "./sections/Vaccine_RatesSection";

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
