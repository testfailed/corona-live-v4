import {
  ChartConfig,
  ChartData,
  ChartVisualizerData,
} from "@components/chart/Chart_Visualizer";
import { theme } from "@styles/stitches.config";
import {
  ChartCondition,
  ChartStatOptions,
  ChartDefaultOption,
  ChartRangeOption,
  ChartTypeOption,
  OptionValue,
} from "@_types/chart-type";
import dayjs, { Dayjs } from "dayjs";
import { getDaysInMonth } from "./date-util";
import { koreanNumberFormat, numberWithCommas } from "./number-util";
import { formatObjectValues } from "./object-util";

export const chartTypeOptions = (config?: {
  omit?: Array<ChartTypeOption>;
  pick?: Array<ChartTypeOption>;
  disable?: Array<ChartTypeOption>;
}): Partial<Record<ChartTypeOption, OptionValue>> => {
  const { omit = [], disable = [], pick } = config ?? {};

  const options: Partial<Record<ChartTypeOption, OptionValue>> = {
    daily: {
      label: "일별",
    },
    weekly: {
      label: "주별",
    },
    monthly: {
      label: "월별",
    },
    accumulated: {
      label: "누적",
    },
    live: {
      label: "실시간",
    },
  };

  omit.forEach((key) => delete options[key]);
  disable.forEach((key) => (options[key].disabled = true));

  if (pick !== undefined)
    return pick.reduce(
      (obj, value) => ((obj[value] = options[value]), obj),
      {}
    );

  return options;
};

export const chartRangeOptions = (config?: {
  omit?: Array<ChartRangeOption>;
  pick?: Array<ChartRangeOption>;
  disable?: Array<ChartRangeOption>;
}): Partial<Record<ChartRangeOption, OptionValue>> => {
  const { omit = [], disable = [], pick } = config ?? {};

  const options: Partial<Record<ChartRangeOption, OptionValue>> = {
    oneWeek: {
      label: "1주",
    },
    oneMonth: {
      label: "1달",
    },
    threeMonths: {
      label: "3달",
    },
    all: {
      label: "전체",
    },
  };

  omit.forEach((key) => delete options[key]);
  disable.forEach((key) => (options[key].disabled = true));

  if (pick !== undefined)
    return pick.reduce(
      (obj, value) => ((obj[value] = options[value]), obj),
      {}
    );

  return options;
};

export const getInvalidRangeOptionsByType = (
  type: ChartTypeOption
): Array<ChartRangeOption> => {
  switch (type) {
    case "accumulated":
      return ["oneWeek", "oneMonth", "threeMonths"];
    case "monthly":
      return ["oneWeek", "oneMonth", "threeMonths"];
    case "weekly":
      return ["oneWeek"];
    default:
      return [];
  }
};

interface CreateChartStatOptions<Stat extends string, Option extends string> {
  create: <Config extends {}>(
    config: ChartStatOptions<Stat, Option, Config>
  ) => any;
}

export const createChartStatOptions = <
  Stat extends string,
  Option extends string
>() => {
  const create: CreateChartStatOptions<Stat, Option>["create"] = (config) => {
    const stats = Object.keys(config) as Array<Stat>;
    return stats.reduce((obj, stat) => {
      const { options } = config[stat];
      const overrideOptionsIf = config[stat]?.overrideOptionsIf;

      const rangeOptions = Object.keys(options.range) as ChartRangeOption[];
      const typeOptions = Object.keys(options.type) as ChartTypeOption[];

      obj[stat] = {
        ...config[stat],
        overrideOptionsIf: [
          ...(overrideOptionsIf ?? []),
          ...(options.type
            ? typeOptions
                .filter((type) => type !== "live")
                .map((type) => {
                  return {
                    type,
                    options: {
                      range: chartRangeOptions({
                        pick: rangeOptions,
                        disable: getInvalidRangeOptionsByType(type).concat(
                          rangeOptions?.filter(
                            (range) => options.range[range].disabled === true
                          ) || []
                        ),
                      }),
                    },
                  } as ChartCondition<{}, ChartDefaultOption>;
                })
            : []),
        ],
      };
      return obj;
    }, {} as typeof config);
  };
  return create;
};

const rangeTypeLabel: Record<ChartTypeOption, string> = {
  weekly: "일평균",
  monthly: "일평균",
  accumulated: "누적",
  daily: "총",
  live: "",
};

export const getDefaultChartConfig = (
  options: {
    type?: ChartTypeOption;
    range?: ChartRangeOption;
  },
  config?: {
    chartType?: "line" | "bar";
    color?: any;
    tooltipLabel?: string;
  } & Partial<ChartConfig>
): ChartConfig => {
  const { type, range } = options;
  const {
    chartType: _chartType,
    tooltipLabel,
    color = theme.colors.blue500,
    ...chartConfig
  } = config ?? {};

  const chartType =
    _chartType ??
    ((range === "all" && type === "daily") || type === "accumulated"
      ? "line"
      : "bar");

  return {
    type: chartType,
    ...(chartType === "line" && {
      lineColor: color,
      lineThickness: type === "live" ? 1 : 2,
      lineType: "linear",
    }),

    ...(chartType === "bar" && {
      barColor: color,
      activeBarColor: color,
      barThickness: 10,
    }),

    pointColor: color,
    pointRadius: 6,

    legendColor: color,

    showLabel:
      range === "oneWeek" || (range === "oneMonth" && type === "weekly"),
    labelFormat: (value) => numberWithCommas(value),

    tooltipFormat: (value) => numberWithCommas(value),
    tooltipLabel: tooltipLabel ?? rangeTypeLabel[type],
    tooltipUnit: "명",
    yAxisPosition: "right",

    ...chartConfig,
  };
};

export const getDefaultChartXAxis = (
  config: {
    type?: ChartTypeOption;
    range?: ChartRangeOption;
  },
  override?: Partial<ChartVisualizerData["xAxis"]>
): ChartVisualizerData["xAxis"] => {
  const { type } = config;

  return {
    format: (value) => {
      let _value: Dayjs;
      switch (type) {
        case "live":
          return Number(value) && Number(value) !== 0
            ? `${value}시`
            : value.toString();

        case "weekly":
          _value = value as Dayjs;
          return `${_value.month() + 1}월${Math.ceil(_value.date() / 7)}주`;

        case "monthly":
          _value = value as Dayjs;
          return `${_value.month() + 1}월`;
        default:
          return dayjs(value).format("M.DD");
        // return dayjs(value).subtract(1, "day").format("MM/DD");
      }
    },
    tooltipFormat: (value) => {
      let _value: Dayjs;

      override?.tooltipFormat?.(value);
      switch (type) {
        case "live":
          return Number(value) && Number(value) !== 0
            ? `${value}시 기준`
            : value?.toString();
        case "weekly":
          _value = value as Dayjs;
          return `${_value.year()}년 ${_value.month() + 1}월${Math.ceil(
            _value.date() / 7
          )}주`;

        case "monthly":
          _value = value as Dayjs;
          return `${_value.year()}년 ${_value.month() + 1}월`;

        case "daily":
          // const day = "일월화수목금토"[dayjs(value).subtract(1, "day").day()];
          const day = "일월화수목금토"[dayjs(value).day()];

          return `${dayjs(value)
            // .subtract(1, "day")
            .format("YYYY.MM.DD")} (${day})`;

        default:
          return dayjs(value).format("YYYY.MM.DD");
        // return dayjs(value).subtract(1, "day").format("YYYY-MM-DD");
      }
    },
    scaleType: type === "live" ? "linear" : "date",
  };
};

export const getDefaultChartYAxis = (
  options: {
    type: ChartTypeOption;
    range: ChartRangeOption;
  },
  override?: ChartVisualizerData["yAxis"]
): ChartVisualizerData["yAxis"] => {
  const { range, type } = options;
  return {
    right: {
      beginAtZero: true,
      format: (value) => koreanNumberFormat(value),
      position: "right",
      visibility:
        range === "oneWeek" || (range === "oneMonth" && type === "weekly")
          ? "hidden"
          : "visible",
      ...override?.right,
    },
    ...(override?.left ? { left: override?.left } : {}),
  };
};

export const getChartRangeSlug = (value: ChartRangeOption) => {
  switch (value) {
    case "oneWeek":
      return 7;
    // case "twoWeeks":
    case "oneMonth":
    case "threeMonths":
      return 90;
    default:
      return value;
  }
};

export const getChartRangeLength = (value: ChartRangeOption) => {
  switch (value) {
    case "oneWeek":
      return 7;
    case "oneWeekExtra":
      return 8;
    case "twoWeeks":
      return 14;
    case "oneMonth":
      return 30;
    case "threeMonths":
      return 90;
    default:
      return 91;
  }
};

export const transformChartData = (
  _chartData: ChartData["data"],
  type: ChartTypeOption,
  range: ChartRangeOption,
  fractionDigits?: number
) => {
  let chartData = _chartData;

  if (type !== "live") {
    chartData = Object.keys(_chartData).reduce((obj, date) => {
      const newDate = dayjs(date).subtract(1, "day").format("YYYY-MM-DD");
      obj[newDate] = _chartData[date];
      return obj;
    }, {});
  }

  const timeperiods =
    range === "all"
      ? Object.keys(chartData)
      : Object.keys(chartData).slice(-getChartRangeLength(range));

  let today = dayjs(timeperiods[timeperiods.length - 1]);

  switch (type) {
    case "daily":
      return timeperiods.reduce(
        (obj, date) => ((obj[date] = chartData[date]), obj),
        {}
      );

    case "weekly":
      let currentDate;

      return formatObjectValues(
        timeperiods.reduce((obj, date) => {
          const day = new Date(date).getDay();
          if (day === 0) currentDate = date;

          if (currentDate !== undefined) {
            obj[currentDate] = (obj[currentDate] || 0) + chartData[date];
          }

          return obj;
        }, {}),
        (value, date) => {
          const diff = today.diff(date, "day");
          const divider = Math.min(7, diff + 1);

          return Number((value / divider).toFixed(fractionDigits ?? 0));
        }
      );

    case "monthly":
      return formatObjectValues(
        timeperiods.reduce((obj, date) => {
          let yearMonth = date.match(/\d{4}-\d{2}/)[0];
          if (yearMonth != "2020-01") {
            obj[`${yearMonth}-01`] =
              (obj[`${yearMonth}-01`] || 0) + chartData[date];
          }
          return obj;
        }, {}),
        (value, date: string) => {
          const [year, month] = date.split("-").map(Number);
          const daysInMonth = getDaysInMonth(year, month);

          const diff = today.diff(date, "day");

          const divider = Math.min(daysInMonth, diff + 1);

          return Number((value / divider).toFixed(fractionDigits ?? 0));
        }
      );

    case "accumulated":
      return timeperiods.reduce((obj, date, index) => {
        let prevDate = timeperiods[index - 1];
        obj[date] = (obj[prevDate] || 0) + chartData[date];
        return obj;
      }, {});

    case "live":
    default:
      return chartData;
  }
};
