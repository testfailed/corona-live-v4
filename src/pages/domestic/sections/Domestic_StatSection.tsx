import React from "react";

import useApi from "@hooks/useApi";

import StatsBoard from "@components/StatsBoard";
import { StatsBoardSkeleton } from "@components/StatsBoard";
import type { StatsBoardStat } from "@components/StatsBoard";
import DomesticApi from "@apis/domestic-api";
import Section from "@components/Section";

const DomesticStat: React.FC = () => {
  const { data } = useApi(DomesticApi.stat);

  const {
    confirmed,
    deceased,
    confirmedSevereSymptoms,
    confirmedOmicron,
    recovered,
  } = data.overview!;

  const stats: Array<StatsBoardStat> = [
    {
      label: "확진자",
      color: "red",
      value: confirmed[0],
      delta: confirmed[1],
    },
    {
      label: "사망자",
      color: "grey",
      value: deceased[0],
      delta: deceased[1],
    },

    {
      label: "완치자",
      color: "blue",
      value: recovered[0],
      delta: recovered[1],
    },
    // {
    //   label: "오미크론",
    //   color: "blue",
    //   value: confirmedOmicron[0],
    //   delta: confirmedOmicron[1],
    // },
    {
      label: "위중증자",
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
