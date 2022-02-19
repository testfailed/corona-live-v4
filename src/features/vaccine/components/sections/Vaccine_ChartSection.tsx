import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";

import { theme } from "@styles/stitches.config";

import Section from "@components/Section";

import {
  generateChartTypeSubOptions,
  generateChartRangeSubOptions,
  createChartOptions,
  transformChartData,
  getDefaultChartYAxis,
  getDefaultChartXAxis,
  getDefaultChartConfig,
} from "@features/chart/chart-util";
import Chart, { ChartSkeleton } from "@features/chart/components/Chart";
import useCachedChartData from "@features/chart/hooks/useCachedChartData";

import type {
  ChartProps,
  ChartDefaultSubOptionValues,
} from "@features/chart/chart-type";
import type { ChartData } from "@features/chart/components/Chart_Visualiser";

export type VaccineMainOption = "pfizer" | "jansen" | "moderna" | "all";

interface VaccineSubOptionValues extends ChartDefaultSubOptionValues {}

type VaccineSubOption = keyof VaccineSubOptionValues;

export const VaccineChartSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { getCachedChartData } = useCachedChartData("vaccine");

  const chartOptions = useMemo(
    () =>
      createChartOptions<VaccineMainOption, VaccineSubOption>()({
        all: {
          label: t("stat.vaccine.all"),
          options: {
            type: generateChartTypeSubOptions({
              omit: ["live", "accumulated"],
            }),
            range: generateChartRangeSubOptions(),
          },
        },

        pfizer: {
          label: t("stat.vaccine.pfizer"),
          options: {
            type: generateChartTypeSubOptions({
              omit: ["live", "accumulated"],
            }),
            range: generateChartRangeSubOptions(),
          },
        },
        moderna: {
          label: t("stat.vaccine.moderna"),
          options: {
            type: generateChartTypeSubOptions({
              omit: ["live", "accumulated"],
            }),
            range: generateChartRangeSubOptions(),
          },
        },
        jansen: {
          label: t("stat.vaccine.jansen"),
          options: {
            type: generateChartTypeSubOptions({
              omit: ["live", "accumulated"],
            }),
            range: generateChartRangeSubOptions(),
          },
        },
      }),
    [i18n.language]
  );

  const getChartData: ChartProps<
    VaccineMainOption,
    VaccineSubOption
  >["getChartData"] = async (selectedMainOption, selectedSubOptions) => {
    let dataSet: ChartData[] = [];

    const { range, type } = selectedSubOptions;

    const xAxis = getDefaultChartXAxis({ type, range });
    const yAxis = getDefaultChartYAxis({ type, range });

    if (selectedMainOption === "all") {
      const data = await getCachedChartData({
        mainOptions: ["first-and-second"],
        range,
      });

      dataSet = [
        {
          data: transformChartData(data.booster, { type, range }),
          config: getDefaultChartConfig(
            { type, range },
            {
              isStack: true,
              chartType: "bar",
              zIndex: 100,
              tooltipLabel: t("stat.vaccine.third_dose.shortened"),
              color: theme.colors.blue500,
              showLabel: range === "oneWeek",
              tooltipUnit: "",
            }
          ),
        },
        {
          data: transformChartData(data.second, { type, range }),
          config: getDefaultChartConfig(
            { type, range },
            {
              isStack: true,
              chartType: "bar",
              zIndex: 100,
              tooltipLabel: t("stat.vaccine.second_dose.shortened"),
              color: theme.colors.blue400,
              showLabel: range === "oneWeek",
              tooltipUnit: "",
            }
          ),
        },
        {
          data: transformChartData(data.first, { type, range }),

          config: getDefaultChartConfig(
            { type, range },
            {
              isStack: true,
              chartType: "bar",
              zIndex: 100,
              tooltipLabel: t("stat.vaccine.first_dose.shortened"),
              color: theme.colors.blue200,
              showLabel: range === "oneWeek",
              tooltipUnit: "",
            }
          ),
        },
      ];
    } else {
      const data = await getCachedChartData({
        mainOptions: [selectedMainOption],
        range,
      });
      dataSet = [
        {
          data: transformChartData(data, { type, range }),
          config: getDefaultChartConfig({ type, range }),
        },
      ];
    }

    return {
      dataSet,
      xAxis,
      yAxis,
    };
  };

  return (
    <Section>
      <Chart {...{ chartOptions, getChartData }} />
    </Section>
  );
};

export const VaccineChartSectionSkeleton = () => {
  return (
    <Section>
      <ChartSkeleton tabs={5} />
    </Section>
  );
};
