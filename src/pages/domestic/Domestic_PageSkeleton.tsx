import React from "react";

import Column from "@components/Column";
import { DomesticStatSkeleton } from "../../features/domestic/components/sections/Domestic_StatSection";
import { DomesticLiveSkeleton } from "../../features/domestic/components/sections/Domestic_LiveSection";
import { DomesticCitySectionSkeleton } from "../../features/domestic/components/sections/Domestic_CitySection";
import { DomesticChartSectionSkeleton } from "../../features/domestic/components/sections/Domestic_ChartSection";

const DomesticPageSkeleton: React.FC = (props) => {
  return (
    <Column>
      <DomesticStatSkeleton />
      <DomesticLiveSkeleton />
      <DomesticChartSectionSkeleton />
      <DomesticCitySectionSkeleton />
    </Column>
  );
};

export default DomesticPageSkeleton;
