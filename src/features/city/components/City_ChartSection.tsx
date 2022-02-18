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

import type {
  ChartDefaultSubOptionValues,
  ChartProps,
} from "@features/chart/chart-type";
import type { ChartData } from "@features/chart/components/Chart_Visualiser";

type CityMainOption = "confirmed";

interface CitySubOptionValues extends ChartDefaultSubOptionValues {}

type CitySubOption = keyof CitySubOptionValues;

const chartOptions = createChartOptions<CityMainOption, CitySubOption>()({
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

  const getChartData: ChartProps<
    CityMainOption,
    CitySubOption
  >["getChartData"] = async (mainOption, subOptions) => {
    let dataSet: ChartData[] = [];

    const { range, type } = subOptions as CitySubOptionValues;

    const xAxis = getDefaultChartXAxis({ range, type });
    const yAxis = getDefaultChartYAxis({ range, type });

    const data = await getCachedChartData({
      mainOptions: [mainOption],
      range,
    });

    dataSet = [
      {
        data: transformChartData(data, {
          type,
          range,
        }),
        config: getDefaultChartConfig(subOptions),
      },
    ];

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

export const CityChartSectionSkeleton = () => {
  return (
    <Section>
      <ChartSkeleton tabs={1} />
    </Section>
  );
};
