import React from "react";

import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";
import VaccinApi from "@features/vaccine/vaccine-api";

import StatsBoard, {
  StatsBoardSkeleton,
  StatsBoardStat,
} from "@components/StatsBoard";
import Section from "@components/Section";

export const VaccineStatSection: React.FC = () => {
  const { t } = useTranslation();

  const { data } = useApi(VaccinApi.stat);

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

export const VaccineStatSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <StatsBoardSkeleton columns={3} />
    </Section>
  );
};
