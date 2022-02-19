import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";

import Section from "@components/Section";

import {
  generateChartRangeSubOptions,
  generateChartTypeSubOptions,
  createChartOptions,
  getDefaultChartConfig,
  getDefaultChartXAxis,
  getDefaultChartYAxis,
  transformChartData,
} from "@features/chart/chart-util";
import Chart, { ChartSkeleton } from "@features/chart/components/Chart";
import useCachedChartData from "@features/chart/hooks/useCachedChartData";

import type { ChartData } from "@features/chart/components/Chart_Visualiser";
import type {
  ChartDefaultSubOptionValues,
  ChartProps,
} from "@features/chart/chart-type";

export type WorldMainOption = "confirmed" | "deceased";

interface WorldSubOptionValues extends ChartDefaultSubOptionValues {}

type WorldSubOption = keyof WorldSubOptionValues;

const WorldChartSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const { getCachedChartData } = useCachedChartData<WorldMainOption>("world");

  const chartOptions = useMemo(
    () =>
      createChartOptions<WorldMainOption, WorldSubOption>()({
        confirmed: {
          label: t("stat.confirmed"),
          options: {
            type: generateChartTypeSubOptions({
              omit: ["live", "accumulated"],
            }),
            range: generateChartRangeSubOptions(),
            compare: null,
          },
        },
        deceased: {
          label: t("stat.deceased"),

          options: {
            type: generateChartTypeSubOptions({
              omit: ["live", "accumulated"],
            }),
            range: generateChartRangeSubOptions(),
          },
        },
      }),
    [t, i18n.language]
  );

  const getChartData: ChartProps<
    WorldMainOption,
    WorldSubOption
  >["getChartData"] = async (mainOption, subOptions, { mode }) => {
    let dataSet: ChartData[] = [];

    const { range, type } = subOptions as WorldSubOptionValues;

    const xAxis = getDefaultChartXAxis({ type, range });
    const yAxis = getDefaultChartYAxis({ type, range });

    if (mode === "EXPANDED") {
      const data = await getCachedChartData({
        mainOptions: ["confirmed", "deceased"],
        apiName: "all",
        range: "oneMonth",
        isCompressed: true,
      });

      const statLabel: Partial<Record<WorldMainOption, string>> = {
        confirmed: "확진자",
        deceased: "사망자",
      };

      return Object.keys(data).map((key) => ({
        dataSet: [
          {
            data: transformChartData(data[key], { type, range }),
            config: getDefaultChartConfig(
              { type, range },
              {
                statLabel: statLabel[key],
              }
            ),
          },
        ],
        xAxis,
        yAxis,
      }));
    } else {
      const xAxis = getDefaultChartXAxis({ type, range });
      const yAxis = getDefaultChartYAxis({ type, range });

      const data = await getCachedChartData({
        mainOptions: [mainOption],
        range,
      });
      dataSet = [
        {
          data: transformChartData(data, subOptions),
          config: getDefaultChartConfig(subOptions),
        },
      ];

      return {
        dataSet,
        xAxis,
        yAxis,
      };
    }
  };

  return (
    <Section>
      <Chart enableExpandMode {...{ chartOptions, getChartData }} />
    </Section>
  );
};

export const WorldChartSectionSkeleton = () => {
  return (
    <Section>
      <ChartSkeleton tabs={2} />
    </Section>
  );
};

export default WorldChartSection;
