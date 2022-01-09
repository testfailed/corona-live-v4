import React from "react";

import useApi from "@hooks/useApi";
import VaccinApi from "@apis/vaccine-api";

import StatsBoard, {
  StatsBoardSkeleton,
  StatsBoardStat,
} from "@components/StatsBoard";
import Section from "@components/Section";

const VaccineBoard: React.FC = () => {
  const { data } = useApi(VaccinApi.stat);

  const { partiallyVaccinated, fullyVaccinated, booster } = data.overview!;

  const stats: Array<StatsBoardStat> = [
    {
      label: "1차 접종",
      color: "grey",
      // value: partiallyVaccinated.rates.toFixed(1) + "%",
      value: partiallyVaccinated.total,
      delta: partiallyVaccinated.delta,
    },

    {
      label: "2차 접종",
      color: "blue",
      // value: fullyVaccinated.rates.toFixed(1) + "%",
      value: fullyVaccinated.total,
      delta: fullyVaccinated.delta,
    },

    {
      label: "3차 접종",
      color: "red",
      // value: booster.rates.toFixed(1) + "%",
      value: booster.total,
      delta: booster.delta,
    },
  ];

  return (
    <Section>
      <StatsBoard stats={stats} />
    </Section>
  );
};

export const VaccineStatSkeleton: React.FC = () => {
  return (
    <Section>
      <StatsBoardSkeleton columns={3} />
    </Section>
  );
};

export default VaccineBoard;
