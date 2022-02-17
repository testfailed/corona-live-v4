import React from "react";

import Column from "@components/Column";

import { DomesticStatSectionSkeleton } from "@features/domestic/components/sections/Domestic_StatSection";
import { DomesticLiveSectionSkeleton } from "@features/domestic/components/sections/Domestic_LiveSection";
import { DomesticCitySectionSkeleton } from "@features/domestic/components/sections/Domestic_CitySection";
import { DomesticChartSectionSkeleton } from "@features/domestic/components/sections/Domestic_ChartSection";

const DomesticPageSkeleton: React.FC = () => {
  return (
    <Column>
      <DomesticStatSectionSkeleton />
      <DomesticLiveSectionSkeleton />
      <DomesticChartSectionSkeleton />
      <DomesticCitySectionSkeleton />
    </Column>
  );
};

export default DomesticPageSkeleton;
