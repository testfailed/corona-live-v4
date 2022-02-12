import React from "react";

import useApi from "@hooks/useApi";

import StatsBoard from "@components/StatsBoard";
import { StatsBoardSkeleton } from "@components/StatsBoard";
import type { StatsBoardStat } from "@components/StatsBoard";
import DomesticApi from "@features/domestic/domestic-api";
import Section from "@components/Section";
import { useTranslation } from "react-i18next";

const DomesticStat: React.FC = () => {
  const { data } = useApi(DomesticApi.stat);
  const { t } = useTranslation();

  const { confirmed, deceased, confirmedSevereSymptoms, recovered } =
    data.overview!;

  const stats: Array<StatsBoardStat> = [
    {
      label: t("stat.confirmed"),
      color: "red",
      value: confirmed[0],
      delta: confirmed[1],
    },
    {
      label: t("stat.deceased"),
      color: "grey",
      value: deceased[0],
      delta: deceased[1],
    },

    {
      label: t("stat.recovered"),
      color: "blue",
      value: recovered[0],
      delta: recovered[1],
    },

    {
      label: t("stat.confirmed_critical"),
      color: "grey",
      value: confirmedSevereSymptoms[0],
      delta: confirmedSevereSymptoms[1],
    },
  ];

  return (
    <Section>
      <StatsBoard stats={stats} />
    </Section>
  );
};

export const DomesticStatSkeleton: React.FC = () => {
  return (
    <Section>
      <StatsBoardSkeleton columns={4} />
    </Section>
  );
};

export default DomesticStat;
