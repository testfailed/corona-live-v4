import React from "react";

import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";

import DomesticApi from "@features/domestic/domestic-api";

import Section from "@components/Section";
import StatsBoard from "@components/StatsBoard";
import { StatsBoardSkeleton } from "@components/StatsBoard";
import type { StatsBoardStat } from "@components/StatsBoard";

export const DomesticStatSection: React.FC = () => {
  const { data } = useApi(DomesticApi.stat);
  const { t } = useTranslation();

  const { confirmed, deceased, confirmedCritical, hospitalised } =
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
      label: t("stat.hospitalised"),
      color: "blue",
      value: hospitalised[0],
      delta: hospitalised[1],
    },

    {
      label: t("stat.confirmed_critical"),
      color: "grey",
      value: confirmedCritical[0],
      delta: confirmedCritical[1],
    },
  ];

  return (
    <Section>
      <StatsBoard stats={stats} />
    </Section>
  );
};

export const DomesticStatSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <StatsBoardSkeleton columns={4} />
    </Section>
  );
};
