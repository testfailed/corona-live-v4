import React from "react";

import Column from "@components/Column";
import { VaccineInfoSkeleton } from "./sections/Vaccine_InfoSection";
import { VaccineStatSkeleton } from "./sections/Vaccine_StatSection";
import { VaccineChartSectionSkeleton } from "./sections/Vaccine_ChartSection";
import { VaccineRatioSectionSkeleton } from "./sections/Vaccine_RatioSection";

const VaccinePageSkeleton: React.FC = (props) => {
  return (
    <Column>
      <VaccineStatSkeleton />
      <VaccineRatioSectionSkeleton />
      <VaccineChartSectionSkeleton />
      <VaccineInfoSkeleton />
    </Column>
  );
};

export default VaccinePageSkeleton;
