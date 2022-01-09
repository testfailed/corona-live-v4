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
import {
  ChartDefaultOption,
  ChartRangeOption,
  ChartTypeOption,
} from "@_types/chart-type";
import {
  ChartData,
  ChartVisualizerData,
} from "@components/chart/Chart_Visualizer";
import { useParams } from "react-router-dom";

type CityStat = "confirmed";
type CityOption = ChartDefaultOption | "compare";

const chartStatOptions = createChartStatOptions<CityStat, CityOption>()({
  confirmed: {
    label: "확진자",
    options: {
      type: chartTypeOptions({ omit: ["accumulated", "live"] }),
      range: chartRangeOptions(),
      compare: null,
    },
  },
  // deceased: {
  //   label: "사망자",
  //   options: {
  //     type: chartTypeOptions({ omit: ["accumulated", "live"] }),
  //     range: chartRangeOptions(),
  //     compare: null,
  //   },
  // },
});

const CityChart: React.FC = () => {
  const params = useParams<{ cityId: string }>();
  const { getCachedChartData } = useCachedChartData(
    `domestic/${params.cityId}`
  );

  const getChartData = async (
    stat: CityStat,
    option: Record<CityOption, string>
  ): Promise<ChartVisualizerData> => {
    let dataSet: ChartData[] = [];

    const type = option?.type as ChartTypeOption;
    const range = option?.range as ChartRangeOption;

    const xAxis = getDefaultChartXAxis({ type, range });
    const yAxis = getDefaultChartYAxis(
      { type, range },
      { right: { id: stat } }
    );

    const data = await getCachedChartData(stat, range);
    dataSet = [
      {
        data,
        config: getDefaultChartConfig({ type, range }),
      },
    ];

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

export const CityChartSectionSkeleton = () => {
  return (
    <Section>
      <ChartSkeleton tabs={1} />
    </Section>
  );
};

export default CityChart;
