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

import type {
  ChartDefaultOption,
  ChartRangeOption,
  ChartTypeOption,
} from "@_types/chart-type";
import type {
  ChartData,
  ChartVisualizerData,
} from "@components/chart/Chart_Visualizer";

type DomesticStat =
  | "confirmed"
  | "confirmed-overseas"
  | "deceased"
  | "tested"
  | "confirmed-severe-symptoms"
  | "tested-positive-rates";
// | "recovered";
// | "confirmed-omicron";
type DomesticOption = ChartDefaultOption | "compare";

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
  const { data: liveData } = useApi(DomesticApi.live);
  const { forceUpdate, shoulUpdate } = useDomesticChartForceUpdateStore(
    ({ forceUpdate, shoulUpdate }) => ({ forceUpdate, shoulUpdate })
  );

  useUpdateEffect(() => {
    forceUpdate();
  }, [liveData]);

  const chartStatOptions = useMemo(
    () =>
      createChartStatOptions<DomesticStat, DomesticOption>()({
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
        "confirmed-overseas": {
          label: "해외유입",
          options: {
            type: chartTypeOptions({ omit: ["live", "accumulated"] }),
            range: chartRangeOptions(),
          },
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
    option: Record<DomesticOption, string>
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
    } else if (
      stat === "confirmed" &&
      range === "oneWeek" &&
      type === "daily"
    ) {
      const data = await getCachedChartData(
        "confirmed-domestic-overseas",
        range
      );

      dataSet = [
        {
          data: data.domestic,
          config: getDefaultChartConfig(
            {
              type,
              range,
            },
            {
              color: theme.colors.blue500,
              tooltipLabel: "국내",
              chartType: "bar",
              isStack: true,
            }
          ),
        },
        {
          data: data.overseas,
          config: getDefaultChartConfig(
            {
              type,
              range,
            },
            {
              color: theme.colors.gray400,
              tooltipLabel: "해외",
              chartType: "bar",
              isStack: true,
            }
          ),
        },
      ];
    } else {
      const data = await getCachedChartData(stat, range);
      dataSet = [
        {
          data,
          config: getDefaultChartConfig(
            { type, range },
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

    return {
      dataSet: dataSet.map(({ data, config }) => ({
        config,
        data: transformChartData(
          data,
          type,
          stat === "confirmed" && range === "oneWeek" ? "oneWeekExtra" : range,
          stat === "tested-positive-rates" ? 2 : 0
        ),
      })),
      xAxis,
      yAxis,
    };
  };

  return (
    <Section>
      <Chart
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
