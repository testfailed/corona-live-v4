import React from "react";

import { theme } from "@styles/stitches.config";
import useCachedChartData from "@features/chart/hooks/useCachedChartData";

import Section from "@components/Section";
import Chart from "@components/chart/Chart";
import { ChartSkeleton } from "@components/chart/Chart";

import {
  chartRangeOptions,
  chartTypeOptions,
  createChartStatOptions,
  getDefaultChartConfig,
  getDefaultChartXAxis,
  getDefaultChartYAxis,
  transformChartData,
} from "@utils/chart-util";

import type {
  ChartDefaultOptionKey,
  ChartRangeOptionValue,
  ChartTypeOptionValue,
} from "@features/chart/chart-type";
import type {
  ChartData,
  ChartVisualiserData,
} from "@components/chart/Chart_Visualiser";

export type VaccineStat = "az" | "pfizer" | "jansen" | "moderna" | "all";

type VaccineOption = ChartDefaultOptionKey;

const chartStatOptions = createChartStatOptions<VaccineStat, VaccineOption>()({
  all: {
    label: "전체",

    options: {
      type: chartTypeOptions({
        omit: ["live", "accumulated"],
      }),
      range: chartRangeOptions(),
    },
  },

  pfizer: {
    label: "화이자",

    options: {
      type: chartTypeOptions({
        omit: ["live", "accumulated"],
      }),
      range: chartRangeOptions(),
    },
  },
  moderna: {
    label: "모더나",

    options: {
      type: chartTypeOptions({
        omit: ["live", "accumulated"],
      }),
      range: chartRangeOptions(),
    },
  },
  jansen: {
    label: "얀센",

    options: {
      type: chartTypeOptions({
        omit: ["live", "accumulated"],
      }),
      range: chartRangeOptions(),
    },
  },
  az: {
    label: "AZ",

    options: {
      type: chartTypeOptions({
        omit: ["live", "accumulated"],
      }),
      range: chartRangeOptions(),
    },
  },
});

const VaccineChart: React.FC = () => {
  const { getCachedChartData } = useCachedChartData("vaccine");

  const getChartData = async (
    stat: VaccineStat,
    option: Record<VaccineOption, string>
  ): Promise<Array<ChartVisualiserData>> => {
    let dataSet: ChartData[] = [];

    const type = option?.type as ChartTypeOptionValue;
    const range = option?.range as ChartRangeOptionValue;

    const xAxis = getDefaultChartXAxis({ type, range });
    const yAxis = getDefaultChartYAxis(
      { type, range },
      { right: { id: stat } }
    );

    if (stat === "all") {
      const data = await getCachedChartData({
        stat: ["first-and-second"],
        range,
      });

      dataSet = [
        {
          data: data.booster,
          config: getDefaultChartConfig(
            { type, range },
            {
              isStack: true,
              chartType: "bar",
              zIndex: 100,
              tooltipLabel: "3차",
              color: theme.colors.blue500,
              showLabel: range === "oneWeek",
              tooltipUnit: "",
            }
          ),
        },
        {
          data: data.second,

          config: getDefaultChartConfig(
            { type, range },
            {
              isStack: true,
              chartType: "bar",
              zIndex: 100,
              tooltipLabel: "2차",
              color: theme.colors.blue400,
              showLabel: range === "oneWeek",
              tooltipUnit: "",
            }
          ),
        },
        {
          data: data.first,

          config: getDefaultChartConfig(
            { type, range },
            {
              isStack: true,
              chartType: "bar",
              zIndex: 100,
              tooltipLabel: "1차",
              color: theme.colors.blue200,
              showLabel: range === "oneWeek",
              tooltipUnit: "",
            }
          ),
        },
      ];
    } else {
      const data = await getCachedChartData({ stat: [stat], range });
      dataSet = [{ data, config: getDefaultChartConfig({ type, range }) }];
    }

    return [
      {
        dataSet: dataSet.map(({ data, config }) => ({
          config,
          data: transformChartData(data, { type, range }),
        })),
        xAxis,
        yAxis,
      },
    ];
  };

  return (
    <Section>
      <Chart {...{ chartStatOptions, getChartData }} />
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

export default VaccineChart;
