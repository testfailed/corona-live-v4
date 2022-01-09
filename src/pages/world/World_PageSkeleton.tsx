import React from "react";

import Column from "@components/Column";
import { WorldLiveSectionSkeleton } from "./sections/World_LiveSection";
import { WorldStatSectionSkeleton } from "./sections/World_StatSection";
import { WorldChartSectionSkeleton } from "./sections/World_ChartSection";
import { WorldCountrySectionSkeleton } from "./sections/World_CountrySection";

const WorldPageSkeleton: React.FC = () => {
  return (
    <Column>
      <WorldStatSectionSkeleton />
      <WorldLiveSectionSkeleton />
      <WorldChartSectionSkeleton />
      <WorldCountrySectionSkeleton />
    </Column>
  );
};

export default WorldPageSkeleton;
