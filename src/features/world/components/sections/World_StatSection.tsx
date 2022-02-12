import React from "react";

import useApi from "@hooks/useApi";
import StatsBoard, {
  StatsBoardSkeleton,
  StatsBoardStat,
} from "@components/StatsBoard";
import WorldApi from "@features/world/world-api";
import Section from "@components/Section";
import { useTranslation } from "react-i18next";

const WorldStatSection: React.FC = () => {
  const { data } = useApi(WorldApi.live);
  const { t } = useTranslation();

  const stats: Array<StatsBoardStat> = [
    {
      label: t("stat.confirmed"),
      color: "red",
      value: data.overview.confirmed[0],
      delta: data.overview.confirmed[1],
    },
    {
      label: t("stat.deceased"),
      color: "grey",
      value: data.overview.deceased[0],
      delta: data.overview.deceased[1],
    },
    {
      label: t("stat.recovered"),
      color: "blue",
      value: data.overview.recovered[0],
      delta: data.overview.recovered[1],
    },
  ];

  return (
    <Section>
      <StatsBoard stats={stats} />
    </Section>
  );
};

export const WorldStatSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <StatsBoardSkeleton columns={3} />
    </Section>
  );
};

export default WorldStatSection;
