import React from "react";

import useApi from "@hooks/useApi";
import VaccinApi from "@apis/vaccine-api";

import StatsBoard, {
  StatsBoardSkeleton,
  StatsBoardStat,
} from "@components/StatsBoard";
import Section from "@components/Section";
import { useTranslation } from "react-i18next";

const VaccineBoard: React.FC = () => {
  const { data } = useApi(VaccinApi.stat);
  const { t } = useTranslation();

  const { partiallyVaccinated, fullyVaccinated, booster } = data.overview!;

  const stats: Array<StatsBoardStat> = [
    {
      label: t("stat.vaccine.first_dose"),
      color: "grey",
      value: partiallyVaccinated.total,
      delta: partiallyVaccinated.delta,
    },

    {
      label: t("stat.vaccine.second_dose"),
      color: "blue",
      value: fullyVaccinated.total,
      delta: fullyVaccinated.delta,
    },

    {
      label: t("stat.vaccine.third_dose"),
      color: "red",
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
