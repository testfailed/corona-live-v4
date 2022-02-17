import React from "react";

import Column from "@components/Column";
import { CityStatSectionSkeleton } from "@features/city/components/City_StatSection";
import { CityLiveSectionSkeleton } from "@features/city/components/City_LiveSection";
import { CityTitleSectionSkeleton } from "@features/city/components/City_TitleSection";
import { CityChartSectionSkeleton } from "@features/city/components/City_ChartSection";
import { CityTableSectionSkeleton } from "@features/city/components/City_TableSection";

const CityPageSkelton: React.FC = () => {
  return (
    <Column>
      <CityTitleSectionSkeleton />
      <CityStatSectionSkeleton />
      <CityLiveSectionSkeleton />
      <CityChartSectionSkeleton />
      <CityTableSectionSkeleton />
    </Column>
  );
};

export default CityPageSkelton;
