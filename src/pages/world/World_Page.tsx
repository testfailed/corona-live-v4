import React from "react";

import useApi from "@hooks/useApi";
import WorldApi from "@features/world/world-api";
import { WEB_URL } from "@constants/constants";
import { WORLD_PATH } from "@constants/route-constants";

import Seo from "@components/Seo";
import FadeIn from "@components/FadeIn";
import Column from "@components/Column";

import WorldPageSkeleton from "./World_PageSkeleton";
import WorldStatSection from "@features/world/components/sections/World_StatSection";
import WorldLiveSection from "@features/world/components/sections/World_LiveSection";
import WorldChartSection from "@features/world/components/sections/World_ChartSection";
import WorldTableSection from "@features/world/components/sections/World_TableSection";

const WorldPage: React.FC = () => {
  const { data } = useApi(WorldApi.live);

  return (
    <>
      <Seo
        title={`코로나 라이브 | 세계 코로나 현황`}
        description={"세계 코로나 확진자 현황을 실시간으로 제공합니다"}
        canonical={`${WEB_URL}${WORLD_PATH}`}
      />

      <FadeIn show={data !== undefined} fallback={<WorldPageSkeleton />}>
        <Column>
          <WorldStatSection />
          <WorldLiveSection />
          <WorldChartSection />
          <WorldTableSection />
        </Column>
      </FadeIn>
    </>
  );
};

export default WorldPage;
