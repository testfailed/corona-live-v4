import React from "react";

import Column from "@components/Column";
import { CityStatSkeleton } from "./sections/City_StatSection";
import { CityLiveSkeleton } from "./sections/City_LiveSection";
import { CityChartSectionSkeleton } from "./sections/City_ChartSection";
import { CityTableSectionSkeleton } from "./sections/City_TableSection";
import { CityTitleSectionSkeleton } from "./sections/City_TitleSection";

const CityPageSkelton: React.FC = (props) => {
  return (
    <Column>
      <CityTitleSectionSkeleton />
      <CityStatSkeleton />
      <CityLiveSkeleton />
      <CityChartSectionSkeleton />
      <CityTableSectionSkeleton />
    </Column>
  );
};

export default CityPageSkelton;
