import React from "react";

import Column from "@components/Column";
import { WorldStatSectionSkeleton } from "@features/world/components/sections/World_StatSection";
import { WorldLiveSectionSkeleton } from "@features/world/components/sections/World_LiveSection";
import { WorldChartSectionSkeleton } from "@features/world/components/sections/World_ChartSection";
import { WorldTableSectionSkeleton } from "@features/world/components/sections/World_TableSection";

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
