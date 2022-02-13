import React from "react";

import { useParams } from "react-router-dom";

import Section from "@components/Section";

import {
  chartRangeOptions,
  chartTypeOptions,
  createChartOptions,
  getDefaultChartConfig,
  getDefaultChartXAxis,
  getDefaultChartYAxis,
  transformChartData,
} from "@features/chart/chart-util";
import Chart, { ChartSkeleton } from "@features/chart/components/Chart";
import useCachedChartData from "@features/chart/hooks/useCachedChartData";

import type { ChartDefaultOption } from "@features/chart/chart-type";
import type {
  ChartData,
  ChartVisualiserData,
} from "@features/chart/components/Chart_Visualiser";

type CityStat = "confirmed";

interface CityOption extends ChartDefaultOption {}

type CityOptionKey = keyof CityOption;

const chartOptions = createChartOptions<CityStat, CityOptionKey>()({
  confirmed: {
    label: "확진자",
    options: {
      type: chartTypeOptions({ omit: ["accumulated", "live"] }),
      range: chartRangeOptions(),
      compare: null,
    },
  },
});

export const CityChartSection: React.FC = () => {
  const params = useParams<{ cityId: string }>();
  const { getCachedChartData } = useCachedChartData(
    `domestic/${params.cityId}`
  );

  const getChartData = async (
    stat: CityStat,
    option: CityOption
  ): Promise<ChartVisualiserData> => {
    let dataSet: ChartData[] = [];

    const xAxis = getDefaultChartXAxis(option);
    const yAxis = getDefaultChartYAxis(option, { right: { id: stat } });

    const data = await getCachedChartData({
      stat: [stat],
      range: option.range,
    });
    dataSet = [
      {
        data,
        config: getDefaultChartConfig(option),
      },
    ];

    return {
      dataSet: dataSet.map(({ data, config }) => ({
        config,
        data: transformChartData(data, {
          type: option.type,
          range:
            stat === "confirmed" && option.range === "oneWeek"
              ? "oneWeekExtra"
              : option.range,
        }),
      })),
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

export const CityChartSectionSkeleton = () => {
  return (
    <Section>
      <ChartSkeleton tabs={1} />
    </Section>
  );
};
