import React from "react";

import { theme } from "@styles/stitches.config";
import useCachedChartData from "@features/chart/hooks/useCachedChartData";

import Section from "@components/Section";
import Chart, { ChartSkeleton } from "@features/chart/components/Chart";
import {
  chartTypeOptions,
  chartRangeOptions,
  createChartOptions,
  transformChartData,
  getDefaultChartYAxis,
  getDefaultChartXAxis,
  getDefaultChartConfig,
} from "@features/chart/chart-util";

import type {
  ChartProps,
  ChartDefaultSubOptionValues,
} from "@features/chart/chart-type";
import type { ChartData } from "@features/chart/components/Chart_Visualiser";

export type VaccineMainOption = "pfizer" | "jansen" | "moderna" | "all";

interface VaccineSubOptionValues extends ChartDefaultSubOptionValues {}

type VaccineSubOption = keyof VaccineSubOptionValues;

const chartOptions = createChartOptions<VaccineMainOption, VaccineSubOption>()({
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
});

export const VaccineChartSection: React.FC = () => {
  const { getCachedChartData } = useCachedChartData("vaccine");

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
              tooltipLabel: "3차",
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
              tooltipLabel: "2차",
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
              tooltipLabel: "1차",
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
