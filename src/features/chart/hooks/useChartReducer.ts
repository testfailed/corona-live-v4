import { useReducer } from "react";

import { formatObjectValues, removeNullFromObject } from "@utils/object-util";

import { TabProps } from "@components/Tabs";

import {
  chartRangeOptions,
  chartTypeOptions,
} from "@features/chart/chart-util";

import type { ChartProps, ChartOptions } from "@features/chart/chart-type";
import type { ChartMode, OptionValue } from "@features/chart/chart-type";
import type { ChartVisualiserData } from "@features/chart/components/Chart_Visualiser";

const createReducer =
  <MainOption extends string, SubOption extends string>() =>
  (
    state: ReducerState<MainOption, SubOption>,
    action: ReducerAction<MainOption, SubOption>
  ): ReducerState<MainOption, SubOption> => {
    switch (action.type) {
      case "SET_CHART_DATA":
        return {
          ...state,
          chartData: action.payload.chartData,
        };

      case "TOGGLE_MODE":
        const newMode = state.mode === "DEFAULT" ? "EXPANDED" : "DEFAULT";

        const selectedSubOptions: Record<SubOption, string> = {
          type: "daily",
          range: "oneMonth",
        } as any;

        return {
          ...state,
          mode: newMode,
          subOptions: getSubOptions(
            newMode === "EXPANDED"
              ? selectedSubOptions
              : state.selectedSubOptions,
            { mode: newMode }
          ),
          selectedSubOptions:
            newMode === "EXPANDED"
              ? selectedSubOptions
              : state.selectedSubOptions,
        };

      case "UPDATE_OPTIONS_LIST":
        return {
          ...state,
          subOptions: getSubOptions(state.selectedSubOptions),
        };

      case "UPDATE_SELECTED_OPTIONS":
        return {
          ...state,
          selectedSubOptions: getSelectedSubOptions(state.selectedSubOptions),
        };

      case "CHANGE_SUB_OPTION":
        return {
          ...state,
          selectedSubOptions: getSelectedSubOptions({
            ...state.selectedSubOptions,
            [action.payload.optionName]: action.payload.value,
          }),
        };

      case "CHANGE_MAIN_OPTION":
        return { ...state, selectedMainOption: action.payload.value };

      case "INIT":
        return {
          ...state,
          props: action.payload.props,
          subOptions: getSubOptions(
            getInitialSelectedSubOptions(action.payload.props.chartOptions),
            { chartOptions: action.payload.props.chartOptions }
          ),
          mainOptions: Object.keys(action.payload.props.chartOptions).map(
            (stat) => ({
              value: stat,
              text: action.payload.props.chartOptions[stat].label,
            })
          ),
        };

      default:
        throw new Error();
    }

    function getSelectedSubOptions(prevselectedSubOptions) {
      const { selectedMainOption, props } = state;
      const { chartOptions } = props;
      const newOptionsList = getSubOptions(prevselectedSubOptions);

      return formatObjectValues(newOptionsList, (_, optionName) => {
        const options = newOptionsList[optionName];

        if (
          prevselectedSubOptions[optionName] &&
          options.find(
            ({ value }) => value === prevselectedSubOptions[optionName]
          )?.disabled === false
        ) {
          return prevselectedSubOptions[optionName];
        } else if (
          options.find(
            ({ value }) => value === prevselectedSubOptions[optionName]
          )?.disabled === true
        ) {
          let index = options.findIndex(
            ({ value }) => value === prevselectedSubOptions[optionName]
          );
          let avaliableValue;

          while (options[index] && avaliableValue === undefined) {
            if (!options[index].disabled) {
              avaliableValue = options[index].value;
            }
            if (
              index === options.length - 1 &&
              options[index].disabled === true
            ) {
              index--;
            } else {
              index++;
            }
          }

          while (options[index] && avaliableValue === undefined) {
            if (!options[index].disabled) {
              avaliableValue = options[index].value;
            }
            index++;
          }

          return avaliableValue;
        } else {
          const defaultOptions =
            chartOptions[selectedMainOption]?.defaultOptions;

          return (
            defaultOptions?.[optionName] ??
            (newOptionsList[optionName].filter(
              ({ disabled }) => disabled !== true
            ) ?? newOptionsList[optionName])?.[0]?.value
          );
        }
      }) as Record<SubOption, string>;
    }

    function getSubOptions(
      selectedSubOptions: Record<SubOption, string>,
      config?: {
        mode?: ChartMode;
        chartOptions?: ChartOptions<MainOption, SubOption>;
      }
    ) {
      const { props, selectedMainOption } = state;
      const chartOptions = config?.chartOptions ?? props.chartOptions;

      const transformOptionsList = (options) => {
        return formatObjectValues(
          removeNullFromObject(options),
          (optionValuesObj) => {
            return Object.keys(optionValuesObj).map((optionValue) => ({
              value: optionValue,
              text: optionValuesObj[optionValue].label,
              disabled: !!optionValuesObj[optionValue].disabled,
            })) as Array<TabProps>;
          }
        ) as Record<SubOption, Array<TabProps>>;
      };

      if ((config?.mode ?? state?.mode) === "EXPANDED") {
        return transformOptionsList({
          type: chartTypeOptions({ omit: ["accumulated", "live", "monthly"] }),
          range: chartRangeOptions({ omit: ["all"] }),
        });
      }

      const { options: _options } = chartOptions[selectedMainOption];
      const options = _options;
      const overrideOptionsIf =
        chartOptions[selectedMainOption]?.overrideOptionsIf;

      const overriddenOptions = {
        ...options,
        ...(overrideOptionsIf.find(
          ({ options, equal = true, ...conditions }) => {
            return Object.keys(conditions).every((optionName) => {
              return (
                (conditions[optionName] === selectedSubOptions[optionName]) ===
                equal
              );
            });
          }
        )?.options ?? {}),
      };

      return transformOptionsList(overriddenOptions);
    }
  };

const initReducerState = <MainOption extends string, SubOption extends string>(
  props: ChartProps<MainOption, SubOption>
): ReducerState<MainOption, SubOption> => {
  const { chartOptions, defaultMode } = props;
  const stats = Object.keys(chartOptions) as MainOption[];
  const selectedSubOptions = getInitialSelectedSubOptions(
    chartOptions,
    defaultMode
  );

  return {
    chartData: [],
    mode: props.defaultMode ?? "DEFAULT",
    selectedMainOption: stats[0],
    selectedSubOptions,
    props,
    subOptions: {} as Record<SubOption, Array<TabProps>>,
    mainOptions: [],
  };
};

const useChartReducer = <MainOption extends string, SubOption extends string>(
  props
) => {
  const reducer = createReducer<MainOption, SubOption>();
  const returnValue = useReducer(reducer, null, () =>
    initReducerState<MainOption, SubOption>(props)
  );

  return returnValue;
};

function getInitialSelectedSubOptions<
  MainOption extends string,
  SubOption extends string
>(chartOptions: ChartOptions<MainOption, SubOption>, defaultMode?: ChartMode) {
  const firstMainOption = Object.keys(chartOptions)[0] as MainOption;
  const { options: subOptions, defaultOptions: defaultSubOptions } =
    chartOptions[firstMainOption];

  if (defaultMode === "EXPANDED") {
    return {
      type: "daily",
      range: "oneMonth",
    };
  }

  return formatObjectValues(
    removeNullFromObject(subOptions),
    (subOptionValuesObject: Record<SubOption, OptionValue>, subOptionName) => {
      if (subOptionValuesObject === null) return null;

      const subOptionValues = Object.keys(subOptionValuesObject).filter(
        (value) => subOptionValuesObject[value].disabled !== true
      );

      return defaultSubOptions?.[subOptionName] ?? subOptionValues[0];
    }
  ) as Record<SubOption, string>;
}

interface ReducerState<MainOption extends string, SubOption extends string> {
  props: ChartProps<MainOption, SubOption>;
  mode: ChartMode;
  chartData: Array<ChartVisualiserData>;
  selectedMainOption: MainOption;
  selectedSubOptions: Record<SubOption, string>;
  subOptions: Record<SubOption, Array<TabProps>>;
  mainOptions: Array<TabProps>;
}

type ReducerAction<MainOption extends string, SubOption extends string> =
  | { type: "INIT"; payload: { props: ChartProps<MainOption, SubOption> } }
  | { type: "TOGGLE_MODE" }
  | { type: "UPDATE_OPTIONS_LIST" }
  | { type: "UPDATE_SELECTED_OPTIONS" }
  | {
      type: "SET_CHART_DATA";
      payload: { chartData: Array<ChartVisualiserData> };
    }
  | {
      type: "CHANGE_SUB_OPTION";
      payload: { optionName: string; value: SubOption };
    }
  | { type: "CHANGE_MAIN_OPTION"; payload: { value: MainOption } };

export default useChartReducer;
