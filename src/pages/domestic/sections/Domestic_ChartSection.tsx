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
import { KDCA_DATA_SOURCE } from "@constants/constants";
import { useTranslation } from "react-i18next";

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
  const { t, i18n } = useTranslation();

  useUpdateEffect(() => {
    forceUpdate();
  }, [domesticLiveData]);

  const chartStatOptions = useMemo(
    () =>
      createChartStatOptions<DomesticStat, DomesticOptionKey>()({
        confirmed: {
          label: t("stat.confirmed"),
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
                    label: t("chart.option.yesterday"),
                  },
                  weekAgo: {
                    label: t("chart.option.one_week_ago"),
                  },
                },
                range: null,
              },
            },
          ],
        },
        "confirmed-severe-symptoms": {
          label: t("stat.confirmed_critical"),
          options: {
            type: chartTypeOptions({
              omit: ["live", "accumulated", "monthly"],
            }),
            range: chartRangeOptions({ disable: ["all"] }),
          },
        },
        deceased: {
          label: t("stat.deceased"),

          options: {
            type: chartTypeOptions({ omit: ["live", "accumulated"] }),
            range: chartRangeOptions(),
          },
        },
        "tested-positive-rates": {
          label: t("stat.tested_positive_rates"),
          options: {
            type: chartTypeOptions({
              omit: ["live", "accumulated", "monthly"],
            }),
            range: chartRangeOptions({ disable: ["all"] }),
          },
        },
        tested: {
          label: t("stat.tested"),
          options: {
            type: chartTypeOptions({
              omit: ["live", "accumulated", "monthly"],
            }),
            range: chartRangeOptions({ disable: ["all"] }),
          },
        },
      }),
    [shoulUpdate, i18n.language]
  );

  const chartMode: ChartMode = useMemo(() => {
    return isInTimeRange("09:30:00", "15:00:00") ? "EXPANDED" : "DEFAULT";
  }, [shoulUpdate]);

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
          "confirmed-severe-symptoms",
          "deceased",
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

      const statLabel: Partial<Record<DomesticStat, string>> = {
        confirmed: t("stat.confirmed"),
        deceased: t("stat.deceased"),
        "confirmed-severe-symptoms": t("stat.confirmed_critical"),
        tested: t("stat.tested"),
      };

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
              key === "tested-positive-rates"
                ? {
                    tooltipUnit: "%",
                    statLabel: t("stat.tested_positive_rates"),
                    info: " = 확진자수 / 전일 검사건수",
                  }
                : {
                    statLabel: statLabel[key],
                  }
            ),
          },
        ],
        xAxis,
        yAxis,
        dataSource: KDCA_DATA_SOURCE(),
      }));
    } else {
      const xAxis = getDefaultChartXAxis(option);
      const yAxis = getDefaultChartYAxis(option, { right: { id: stat } });

      if (stat === "confirmed" && option.type === "live") {
        const today = domesticLiveData.hourlyLive["today"];
        const compared = domesticLiveData.hourlyLive[option.compare];

        const liveLabel: Record<ChartCompareOptionValue, string> = {
          yesterday: t("live.yesterday"),
          weekAgo: t("live.one_week_ago"),
          twoWeeksAgo: t("live.two_weeks_ago"),
          monthAgo: t("live.one_month_ago"),
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
                    tooltipLabel: "",
                    info:
                      stat === "tested-positive-rates"
                        ? " = 확진자수 / 전일 검사건수"
                        : undefined,
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
          dataSource: option?.type === "live" ? null : KDCA_DATA_SOURCE,
        },
      ];
    }
  };

  return (
    <Section>
      <Chart
        enableExpandMode
        defaultMode={chartMode}
        {...{ chartStatOptions, getChartData, forceUpdate: shoulUpdate }}
      />
    </Section>
  );
};

export const DomesticChartSectionSkeleton = () => {
  const chartMode: ChartMode = useMemo(() => {
    return isInTimeRange("09:30:00", "16:30:00") ? "EXPANDED" : "DEFAULT";
  }, []);

  return (
    <Section>
      <ChartSkeleton tabs={5} mode={chartMode} charts={5} />
    </Section>
  );
};

export default DomesticChartSection;
