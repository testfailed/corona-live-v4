import { TabProps } from "@components/Tabs";
import { formatObjectValues, removeNullFromObject } from "@utils/object-util";
import {
  ChartMode,
  ChartOptions,
  ChartProps,
  OptionValue,
} from "../chart-type";
import {
  generateChartRangeSubOptions,
  generateChartTypeSubOptions,
} from "../chart-util";
import { ChartReducerState } from "./useChartReducer.type";

export const getInitialSelectedSubOptions = <
  MainOption extends string,
  SubOption extends string
>(
  chartProps: ChartProps<MainOption, SubOption>
) => {
  const { chartOptions, defaultMode } = chartProps;
  if (defaultMode === "EXPANDED") {
    return {
      type: "daily",
      range: "oneMonth",
    };
  }

  const selectedMainOption = Object.keys(chartOptions)[0] as MainOption;
  const { options, defaultOptions, overrideOptionsIf } =
    chartOptions[selectedMainOption];

  const overriddenOptions = {
    ...options,
    ...(overrideOptionsIf.find(({ equal = true, ...conditions }) => {
      return Object.keys(conditions).every((optionName) => {
        if (optionName === "options") return true;

        const expectedValue = conditions[optionName];
        const value = defaultOptions
          ? defaultOptions[optionName]
          : options[optionName][0];

        return (expectedValue === value) === equal;
      });
    })?.options ?? {}),
  };

  return formatObjectValues(
    removeNullFromObject(overriddenOptions),
    (subOptions: Record<SubOption, OptionValue>, subOptionName) => {
      if (subOptions === null) return null;

      const subOptionValues = Object.keys(subOptions).filter(
        (value) => subOptions[value].disabled !== true
      );

      return defaultOptions?.[subOptionName] ?? subOptionValues[0];
    }
  ) as Record<SubOption, string>;
};

export const parseSubOptionsList = <SubOption extends string>(options) => {
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

export const getValidSelectedSubOptions = <
  MainOption extends string,
  SubOption extends string
>(
  state: ChartReducerState<MainOption, SubOption>,

  {
    selectedMainOption = state.selectedMainOption,
    selectedSubOptions = state.selectedSubOptions,
  }: {
    selectedMainOption?: MainOption;
    selectedSubOptions?: Record<SubOption, string>;
  }
) => {
  const { props } = state;
  const { chartOptions } = props;

  const newOptionsList = getSubOptions({
    chartOptions: state.props.chartOptions,
    mode: state.mode,
    selectedMainOption,
    selectedSubOptions,
  });

  return formatObjectValues(newOptionsList, (_, optionName) => {
    const options = newOptionsList[optionName];

    if (
      selectedSubOptions[optionName] &&
      options.find(({ value }) => value === selectedSubOptions[optionName])
        ?.disabled === false
    ) {
      return selectedSubOptions[optionName];
    } else if (
      options.find(({ value }) => value === selectedSubOptions[optionName])
        ?.disabled === true
    ) {
      let index = options.findIndex(
        ({ value }) => value === selectedSubOptions[optionName]
      );
      let avaliableValue;

      while (options[index] && avaliableValue === undefined) {
        if (!options[index].disabled) {
          avaliableValue = options[index].value;
        }
        if (index === options.length - 1 && options[index].disabled === true) {
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
      const defaultOptions = chartOptions[selectedMainOption]?.defaultOptions;

      return (
        defaultOptions?.[optionName] ??
        (newOptionsList[optionName].filter(
          ({ disabled }) => disabled !== true
        ) ?? newOptionsList[optionName])?.[0]?.value
      );
    }
  }) as Record<SubOption, string>;
};

export const getSubOptions = <
  MainOption extends string,
  SubOption extends string
>({
  selectedMainOption,
  selectedSubOptions,
  mode,
  chartOptions,
}: {
  selectedMainOption: MainOption;
  selectedSubOptions: Record<SubOption, string>;
  mode: ChartMode;
  chartOptions: ChartOptions<MainOption, SubOption>;
}) => {
  if (mode === "EXPANDED") {
    return parseSubOptionsList<SubOption>({
      type: generateChartTypeSubOptions({
        omit: ["accumulated", "live", "monthly"],
      }),
      range: generateChartRangeSubOptions({ omit: ["all"] }),
    });
  }

  const { options: _options } = chartOptions[selectedMainOption];
  const options = _options;
  const overrideOptionsIf = chartOptions[selectedMainOption]?.overrideOptionsIf;

  const overriddenOptions = {
    ...options,
    ...(overrideOptionsIf.find(({ options, equal = true, ...conditions }) => {
      return Object.keys(conditions).every((optionName) => {
        return (
          (conditions[optionName] === selectedSubOptions[optionName]) === equal
        );
      });
    })?.options ?? {}),
  };

  return parseSubOptionsList(overriddenOptions);
};
