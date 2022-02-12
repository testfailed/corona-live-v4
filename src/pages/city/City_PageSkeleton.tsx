import React from "react";

import Column from "@components/Column";
import { CityTitleSectionSkeleton } from "@features/city/components/City_TitleSection";
import { CityStatSectionSkeleton } from "@features/city/components/City_StatSection";
import { CityLiveSectionSkeleton } from "@features/city/components/City_LiveSection";
import { CityChartSectionSkeleton } from "@features/city/components/City_ChartSection";
import { CityTableSectionSkeleton } from "@features/city/components/City_TableSection";

const CityPageSkelton: React.FC = (props) => {
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
