import React from "react";

import Column from "@components/Column";
import { WorldLiveSectionSkeleton } from "./sections/World_LiveSection";
import { WorldStatSectionSkeleton } from "./sections/World_StatSection";
import { WorldChartSectionSkeleton } from "./sections/World_ChartSection";
import { WorldTableSectionSkeleton } from "./sections/World_TableSection";

const WorldPageSkeleton: React.FC = () => {
  return (
    <Column>
      <WorldStatSectionSkeleton />
      <WorldLiveSectionSkeleton />
      <WorldChartSectionSkeleton />
      <WorldTableSectionSkeleton />
    </Column>
  );
};

export default WorldPageSkeleton;
