import React, { useState } from "react";

import useApi from "@hooks/useApi";
import useCachedChartData from "@hooks/useCachedChartData";

import Section from "@components/Section";

import { ChartSkeleton } from "@components/chart/Chart";
import Chart from "@components/chart/Chart";
import {
  chartRangeOptions,
  chartTypeOptions,
  createChartStatOptions,
  getDefaultChartConfig,
  getDefaultChartXAxis,
  getDefaultChartYAxis,
  transformChartData,
} from "@utils/chart-util";
import {
  ChartDefaultOption,
  ChartRangeOption,
  ChartTypeOption,
} from "@_types/chart-type";
import {
  ChartData,
  ChartVisualizerData,
} from "@components/chart/Chart_Visualizer";
import { theme } from "@styles/stitches.config";
import WorldApi from "@apis/world-api";

export type WorldChartPrimaryOptions = "deceased" | "confirmed";

export type WorldStat = "confirmed" | "deceased";

type WorldOption = ChartDefaultOption | "compare";

const chartStatOptions = createChartStatOptions<WorldStat, WorldOption>()({
  confirmed: {
    label: "확진자",
    options: {
      type: chartTypeOptions({ omit: ["accumulated"] }),
      range: chartRangeOptions(),
      compare: null,
    },

    overrideOptionsIf: [
      {
        type: "live",
        options: {
          compare: {
            yesterday: {
              label: "어제",
            },
            weekAgo: {
              label: "1주전",
            },
          },
          range: null,
        },
      },
    ],
  },
  deceased: {
    label: "사망자",
    options: {
      type: chartTypeOptions({ omit: ["live", "accumulated"] }),
      range: chartRangeOptions(),
    },
  },
});

const WorldChartSection: React.FC = () => {
  const { getCachedChartData } = useCachedChartData("world");
  const { data: liveData } = useApi(WorldApi.live);

  const getChartData = async (
    stat: WorldStat,
    option: Record<WorldOption, string>
  ): Promise<ChartVisualizerData> => {
    let dataSet: ChartData[] = [];

    const type = option?.type as ChartTypeOption;
    const range = option?.range as ChartRangeOption;
    const compare = option?.compare;

    const xAxis = getDefaultChartXAxis({ type, range });
    const yAxis = getDefaultChartYAxis(
      { type, range },
      { right: { id: stat } }
    );

    if (stat === "confirmed" && type === "live") {
      const today = liveData.hourlyLive["today"];
      const compared = liveData.hourlyLive[compare];

      const liveLabel: Record<string, string> = {
        yesterday: "어제",
        weekAgo: "1주전",
        twoWeeksAgo: "2주전",
        monthAgo: "한달전",
      };

      dataSet = [
        {
          data: compared,
          config: getDefaultChartConfig(
            {
              type,
              range,
            },
            {
              color: theme.colors.gray400,
              tooltipLabel: liveLabel[compare],
              chartType: "line",
              showPoints: true,
            }
          ),
        },
        {
          data: today,
          config: getDefaultChartConfig(
            {
              type,
              range,
            },
            {
              color: theme.colors.blue500,
              tooltipLabel: "오늘",
              chartType: "line",
              showPoints: true,
            }
          ),
        },
      ];
    } else {
      const data = await getCachedChartData(stat, range);
      dataSet = [
        {
          data,
          config: getDefaultChartConfig({ type, range }),
        },
      ];
    }

    return {
      dataSet: dataSet.map(({ data, config }) => ({
        config,
        data: transformChartData(
          data,
          type,
          stat === "confirmed" && range === "oneWeek" ? "oneWeekExtra" : range
        ),
      })),
      xAxis,
      yAxis,
    };
  };

  return (
    <Section>
      <Chart {...{ chartStatOptions, getChartData }} />
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
