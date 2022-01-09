import React from "react";

import Column from "@components/Column";
import { DomesticStatSkeleton } from "./sections/Domestic_StatSection";
import { DomesticLiveSkeleton } from "./sections/Domestic_LiveSection";
import { DomesticCitySectionSkeleton } from "./sections/Domestic_CitySection";
import { DomesticChartSectionSkeleton } from "./sections/Domestic_ChartSection";

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
