import React, { useMemo } from "react";

import { useParams } from "react-router-dom";

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

import type {
  ChartDefaultSubOptionValues,
  ChartProps,
} from "@features/chart/chart-type";
import type { ChartData } from "@features/chart/components/Chart_Visualiser";
import { useTranslation } from "react-i18next";

type CityMainOption = "confirmed";

interface CitySubOptionValues extends ChartDefaultSubOptionValues {}

type CitySubOption = keyof CitySubOptionValues;

export const CityChartSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const params = useParams<{ cityId: string }>();

  const { getCachedChartData } = useCachedChartData(
    `domestic/${params.cityId}`
  );

  const chartOptions = useMemo(
    () =>
      createChartOptions<CityMainOption, CitySubOption>()({
        confirmed: {
          label: t("stat.confirmed"),
          options: {
            type: generateChartTypeSubOptions({
              omit: ["accumulated", "live"],
            }),
            range: generateChartRangeSubOptions(),
            compare: null,
          },
        },
      }),
    [i18n.language]
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
