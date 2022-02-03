import React, { useMemo } from "react";

import create from "zustand";

import {
  chartRangeOptions,
  chartTypeOptions,
  createChartStatOptions,
  getDefaultChartConfig,
  getDefaultChartXAxis,
  getDefaultChartYAxis,
  transformChartData,
} from "@utils/chart-util";

import useApi from "@hooks/useApi";
import DomesticApi from "@apis/domestic-api";
import { theme } from "@styles/stitches.config";
import { isInTimeRange } from "@utils/date-util";
import useUpdateEffect from "@hooks/useUpdatedEffect";
import useCachedChartData from "@hooks/useCachedChartData";

import Section from "@components/Section";
import Chart from "@components/chart/Chart";
import { ChartSkeleton } from "@components/chart/Chart";

import type { ChartDefaultOption, ChartMode } from "@_types/chart-type";
import type {
  ChartData,
  ChartVisualizerData,
} from "@components/chart/Chart_Visualizer";

type DomesticStat =
  | "confirmed"
  | "deceased"
  | "tested"
  | "confirmed-severe-symptoms"
  | "tested-positive-rates";

type ChartCompareOptionValue =
  | "yesterday"
  | "weekAgo"
  | "monthAgo"
  | "twoWeeksAgo";

interface DomesticOption extends ChartDefaultOption {
  compare: ChartCompareOptionValue;
}

type DomesticOptionKey = keyof DomesticOption;

interface State {
  shoulUpdate: number;
  forceUpdate: () => void;
}

export const useDomesticChartForceUpdateStore = create<State>((set) => ({
  shoulUpdate: 0,
  forceUpdate: () => {
    set((state) => ({ shoulUpdate: state.shoulUpdate + 1 }));
  },
}));

const DomesticChartSection: React.FC = () => {
  const { getCachedChartData } = useCachedChartData("domestic");
  const { data: domesticLiveData } = useApi(DomesticApi.live);
  const { forceUpdate, shoulUpdate } = useDomesticChartForceUpdateStore(
    ({ forceUpdate, shoulUpdate }) => ({ forceUpdate, shoulUpdate })
  );

  useUpdateEffect(() => {
    forceUpdate();
  }, [domesticLiveData]);

  const chartStatOptions = useMemo(
    () =>
      createChartStatOptions<DomesticStat, DomesticOptionKey>()({
        confirmed: {
          label: "확진자",
          options: {
            type: chartTypeOptions({ omit: ["accumulated"] }),
            range: chartRangeOptions(),
            compare: null,
          },

          defaultOptions: isInTimeRange("09:30:00", "15:00:00")
            ? { type: "daily" }
            : { type: "live" },

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
        "confirmed-severe-symptoms": {
          label: "위중증자",

          options: {
            type: chartTypeOptions({
              omit: ["live", "accumulated", "monthly"],
            }),
            range: chartRangeOptions({ disable: ["all"] }),
          },
        },
        "tested-positive-rates": {
          label: "확진율",

          options: {
            type: chartTypeOptions({
              omit: ["live", "accumulated", "monthly"],
            }),
            range: chartRangeOptions({ disable: ["all"] }),
          },
        },
        tested: {
          label: "검사자",
          options: {
            type: chartTypeOptions({
              omit: ["live", "accumulated", "monthly"],
            }),
            range: chartRangeOptions({ disable: ["all"] }),
          },
        },
      }),
    [forceUpdate]
  );

  const getChartData = async (
    stat: DomesticStat,
    option: DomesticOption,
    mode: ChartMode
  ): Promise<Array<ChartVisualizerData>> => {
    let dataSet: ChartData[] = [];

    if (mode === "EXPANDED") {
      const data = await getCachedChartData({
        stat: [
          "confirmed",
          "deceased",
          "confirmed-severe-symptoms",
          "tested-positive-rates",
          "tested",
        ] as Array<DomesticStat>,
        apiName: "all",
        range: "oneMonth",
        isCompressed: true,
        isSingle: false,
      });

      const xAxis = getDefaultChartXAxis(option);
      const yAxis = getDefaultChartYAxis(option, { right: { id: stat } });

      return Object.keys(data).map((key) => ({
        dataSet: [
          {
            data: transformChartData(data[key], {
              type: option.type,
              range: option.range,
              fractionDigits: stat === "tested-positive-rates" ? 2 : 0,
            }),
            config: getDefaultChartConfig(
              option,
              stat === "tested-positive-rates"
                ? {
                    tooltipUnit: "%",
                    tooltipLabel: "7일 평균",
                  }
                : {}
            ),
          },
        ],
        xAxis,
        yAxis,
      }));
    } else {
      const xAxis = getDefaultChartXAxis(option);
      const yAxis = getDefaultChartYAxis(option, { right: { id: stat } });

      if (stat === "confirmed" && option.type === "live") {
        const today = domesticLiveData.hourlyLive["today"];
        const compared = domesticLiveData.hourlyLive[option.compare];

        const liveLabel: Record<ChartCompareOptionValue, string> = {
          yesterday: "어제",
          weekAgo: "1주전",
          twoWeeksAgo: "2주전",
          monthAgo: "한달전",
        };

        dataSet = [
          {
            data: compared,
            config: getDefaultChartConfig(option, {
              color: theme.colors.gray400,
              tooltipLabel: liveLabel[option.compare],
              chartType: "line",
              showPoints: true,
            }),
          },
          {
            data: today,
            config: getDefaultChartConfig(option, {
              color: theme.colors.blue500,
              tooltipLabel: "오늘",
              chartType: "line",
              showPoints: true,
            }),
          },
        ];
      } else {
        const data = await getCachedChartData({
          stat: [stat],
          range: option.range,
          isCompressed: option.range === "all",
        });
        dataSet = [
          {
            data: transformChartData(data, {
              type: option.type,
              range: option.range,
              fractionDigits: stat === "tested-positive-rates" ? 2 : 0,
            }),
            config: getDefaultChartConfig(
              option,
              stat === "tested-positive-rates"
                ? {
                    tooltipUnit: "%",
                    tooltipLabel: "7일 평균",
                  }
                : {}
            ),
          },
        ];
      }

      return [
        {
          dataSet,
          xAxis,
          yAxis,
        },
      ];
    }
  };

  return (
    <Section>
      <Chart
        // enableExpandMode
        {...{ chartStatOptions, getChartData, forceUpdate: shoulUpdate }}
      />
    </Section>
  );
};

export const DomesticChartSectionSkeleton = () => {
  return (
    <Section>
      <ChartSkeleton tabs={5} />
    </Section>
  );
};

export default DomesticChartSection;
