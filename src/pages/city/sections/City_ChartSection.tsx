import React, { useState } from "react";

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
import { ChartDefaultOption } from "@_types/chart-type";
import {
  ChartData,
  ChartVisualizerData,
} from "@components/chart/Chart_Visualizer";
import { useParams } from "react-router-dom";

type CityStat = "confirmed";

interface CityOption extends ChartDefaultOption {}

type CityOptionKey = keyof CityOption;

const chartStatOptions = createChartStatOptions<CityStat, CityOptionKey>()({
  confirmed: {
    label: "확진자",
    options: {
      type: chartTypeOptions({ omit: ["accumulated", "live"] }),
      range: chartRangeOptions(),
      compare: null,
    },
  },
});

const CityChart: React.FC = () => {
  const params = useParams<{ cityId: string }>();
  const { getCachedChartData } = useCachedChartData(
    `domestic/${params.cityId}`
  );

  const getChartData = async (
    stat: CityStat,
    option: CityOption
  ): Promise<ChartVisualizerData> => {
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
      <Chart {...{ chartStatOptions, getChartData }} />
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

export default CityChart;
