import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { rem } from "polished";
import { Presence } from "@radix-ui/react-presence";

import { styled, theme } from "@styles/stitches.config";
import { fadeIn, fadeOut } from "@styles/animations/fade-animation";
import { formatObjectValues, removeNullFromObject } from "@utils/object-util";

import useChartSize from "@hooks/useChartSize";
import useUpdateEffect from "@hooks/useUpdatedEffect";
import useDebounceState from "@hooks/useDebounceState";

import ChartStatTabs from "./Chart_StatTabs";
import ChartVisualizer from "./Chart_Visualizer";
import ChartOptionTabs from "./Chart_OptionTabs";

import Row from "@components/Row";
import Space from "@components/Space";
import Loader from "@components/Loader";
import Section from "@components/Section";
import Skeleton from "@components/Skeleton";
import { TabProps } from "@components/Tabs";
import ShrinkIcon from "@components/icon/Icon_Shrink";
import ExpandIcon from "@components/icon/Icon_Expand";

import type { ChartMode } from "@_types/chart-type";
import type { ChartStatOptions } from "@_types/chart-type";
import type { ChartVisualizerData } from "./Chart_Visualizer";
import { chartRangeOptions, chartTypeOptions } from "@utils/chart-util";

const getInitialSelectedOptions = <Stat extends string, Option extends string>(
  chartStatOptions: ChartStatOptions<Stat, Option>
) => {
  const stat = Object.keys(chartStatOptions)[0] as Stat;
  const { options } = chartStatOptions[stat];
  const defaultOptions = chartStatOptions[stat]?.defaultOptions;

  return formatObjectValues(
    removeNullFromObject(options),
    (optionValuesObj, optionName) => {
      if (optionValuesObj === null) return null;
      const optionValueNames = Object.keys(optionValuesObj).filter(
        (optionValue) => optionValuesObj[optionValue].disabled !== true
      );
      return defaultOptions?.[optionName] ?? optionValueNames[0];
    }
  ) as Record<Option, string>;
};

interface Props<Stat extends string, Option extends string> {
  chartStatOptions: ChartStatOptions<Stat, Option>;
  getChartData: (
    selectedStat: Stat,
    selectedOptions: Record<Option, string>,
    mode: ChartMode
  ) => Promise<Array<ChartVisualizerData>>;
  forceUpdate?: any;
}

interface Store<Stat extends string, Option extends string> {
  chartData: Array<ChartVisualizerData>;
  mode: ChartMode;
  isLoading: boolean;
  selectedStat: Stat;
  selectedOptions: Record<Option, string>;
  optionsList: any;
  props: Props<Stat, Option>;
}

type Action<Stat extends string, Option extends string> =
  | {
      type: "SET_CHART_DATA";
      payload: { chartData: Array<ChartVisualizerData> };
    }
  | { type: "FETCH_CHART_DATA" }
  | { type: "TOGGLE_MODE" }
  | { type: "UPDATE_OPTIONS_LIST" }
  | { type: "UPDATE_SELECTED_OPTIONS" }
  | { type: "CHANGE_OPTION"; payload: { optionName: string; value: Option } }
  | { type: "CHANGE_STAT"; payload: { value: Stat } };

const getOptionsList = <Stat extends string, Option extends string>(
  state: Store<Stat, Option>,
  selectedOptions,
  mode?: ChartMode
) => {
  const { props, selectedStat } = state;
  const { chartStatOptions } = props;

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
    ) as Record<Option, Array<TabProps>>;
  };

  if ((mode ?? state?.mode) === "EXPANDED") {
    return transformOptionsList({
      type: chartTypeOptions({ omit: ["accumulated", "live", "monthly"] }),
      range: chartRangeOptions({ omit: ["all"] }),
    });
  }

  const { options: _options } = chartStatOptions[selectedStat];
  const options = _options;
  const overrideOptionsIf = chartStatOptions[selectedStat]?.overrideOptionsIf;

  const overriddenOptions = {
    ...options,
    ...(overrideOptionsIf.find(({ options, equal = true, ...conditions }) => {
      return Object.keys(conditions).every((optionName) => {
        return (
          (conditions[optionName] === selectedOptions[optionName]) === equal
        );
      });
    })?.options ?? {}),
  };

  return transformOptionsList(overriddenOptions);
};

const reducer = <Stat extends string, Option extends string>(
  state: Store<Stat, Option>,
  action: Action<Stat, Option>
): Store<Stat, Option> => {
  switch (action.type) {
    case "SET_CHART_DATA":
      return {
        ...state,
        chartData: action.payload.chartData,
        isLoading: false,
      };

    case "FETCH_CHART_DATA":
      return { ...state, isLoading: true };

    case "TOGGLE_MODE":
      const newMode = state.mode === "DEFAULT" ? "EXPANDED" : "DEFAULT";

      const newSelectedOption = {
        type: "daily",
        range: "oneMonth",
      };

      return {
        ...state,
        mode: newMode,
        optionsList: getOptionsList(
          state,
          newMode === "EXPANDED" ? newSelectedOption : state.selectedOptions,
          newMode
        ),
        selectedOptions:
          newMode === "EXPANDED"
            ? (newSelectedOption as any)
            : state.selectedOptions,
      };

    case "UPDATE_OPTIONS_LIST":
      return {
        ...state,
        optionsList: getOptionsList(state, state.selectedOptions),
      };

    case "UPDATE_SELECTED_OPTIONS":
      return {
        ...state,
        selectedOptions: getSelectedOptions(state.selectedOptions),
      };

    case "CHANGE_OPTION":
      return {
        ...state,
        selectedOptions: getSelectedOptions({
          ...state.selectedOptions,
          [action.payload.optionName]: action.payload.value,
        }),
      };

    case "CHANGE_STAT":
      return { ...state, selectedStat: action.payload.value as any };

    default:
      throw new Error();
  }

  function getSelectedOptions(prevSelectedOptions) {
    const { selectedStat, props } = state;
    const { chartStatOptions } = props;
    const newOptionsList = getOptionsList(state, prevSelectedOptions);

    return formatObjectValues(newOptionsList, (_, optionName) => {
      const options = newOptionsList[optionName];

      if (
        prevSelectedOptions[optionName] &&
        options.find(({ value }) => value === prevSelectedOptions[optionName])
          ?.disabled === false
      ) {
        return prevSelectedOptions[optionName];
      } else if (
        options.find(({ value }) => value === prevSelectedOptions[optionName])
          ?.disabled === true
      ) {
        let index = options.findIndex(
          ({ value }) => value === prevSelectedOptions[optionName]
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
        const defaultOptions = chartStatOptions[selectedStat]?.defaultOptions;

        return (
          defaultOptions?.[optionName] ??
          (newOptionsList[optionName].filter(
            ({ disabled }) => disabled !== true
          ) ?? newOptionsList[optionName])?.[0]?.value
        );
      }
    }) as Record<Option, string>;
  }
};

const init = <Stat extends string, Option extends string>(
  props: Props<Stat, Option>
): Store<Stat, Option> => {
  const { chartStatOptions } = props;
  const stats = Object.keys(chartStatOptions) as Stat[];
  const selectedOptions = getInitialSelectedOptions(chartStatOptions);

  const state: Store<Stat, Option> = {
    chartData: [],
    mode: "DEFAULT",
    isLoading: false,
    selectedStat: stats[0],
    selectedOptions,
    props,
    optionsList: [],
  };

  return { ...state, optionsList: getOptionsList(state, selectedOptions) };
};

const Chart = <Stat extends string, Option extends string>(
  props: Props<Stat, Option>
) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { chartStatOptions, getChartData, forceUpdate } = props;

  const [
    { chartData, optionsList, selectedOptions, selectedStat, mode: _mode },
    dispatch,
  ] = useReducer(reducer, null, () => init<Stat, Option>(props) as any);

  const [mode, setMode] = useState(_mode);
  const stats = Object.keys(chartStatOptions) as Stat[];

  const [wrapperHeight, setWrapperHeight] = useState("auto");
  const [selectedX, setSelectedX] = useState<string>(null);
  const [isLoading, setIsLoading] = useDebounceState(false);

  const statList = useMemo(() => {
    return stats.map((stat) => ({
      value: stat,
      text: chartStatOptions[stat].label,
    })) as Array<TabProps>;
  }, [chartStatOptions]);

  useEffect(() => {
    dispatch({ type: "UPDATE_OPTIONS_LIST" });
  }, [selectedStat, selectedOptions]);

  useEffect(() => {
    dispatch({ type: "UPDATE_SELECTED_OPTIONS" });
  }, [selectedStat]);

  const updateChartData = async () => {
    setIsLoading(true);
    const chartData = await getChartData(
      selectedStat as any,
      selectedOptions,
      _mode
    );
    if (chartData) {
      dispatch({
        type: "SET_CHART_DATA",
        payload: { chartData: [].concat(chartData) },
      });
    }
    setIsLoading(false);
  };

  useUpdateEffect(() => {
    if (isLoading === false || forceUpdate) {
      updateChartData();
    }
  }, [selectedStat, selectedOptions, forceUpdate]);

  const onOptionChange = (optionName: string, value: Option) => {
    dispatch({ type: "CHANGE_OPTION", payload: { optionName, value } });
  };

  const onStatChange = (value: Stat) => {
    dispatch({ type: "CHANGE_STAT", payload: { value } });
  };

  const toggleChartMode = async () => {
    dispatch({ type: "TOGGLE_MODE" });
    await updateChartData();
  };

  useEffect(() => {
    if ((_mode === "EXPANDED" && chartData.length > 1) || _mode === "DEFAULT") {
      setTimeout(() => {
        const { height } = contentRef.current.getBoundingClientRect();
        setWrapperHeight(rem(height));
      }, 0);
      setMode(_mode);
    }
  }, [_mode, chartData]);

  return (
    <Wrapper
      css={{
        height: wrapperHeight,
      }}
    >
      <Content ref={contentRef}>
        <Presence present={isLoading}>
          <LoadingContainer data-state={isLoading ? "show" : "hide"}>
            <Loader />
          </LoadingContainer>
        </Presence>

        <Heading>
          <Row css={{ flex: 1 }}>
            {mode === "DEFAULT" && (
              <ChartStatTabs
                value={selectedStat as any}
                onChange={onStatChange}
                statList={statList}
              />
            )}
            {mode === "EXPANDED" && (
              <Row css={{ paddingY: rem(8), paddingX: rem(8), flex: 1 }}>
                <ChartOptionTabs
                  values={selectedOptions}
                  onChange={onOptionChange}
                  optionList={optionsList}
                />
              </Row>
            )}
          </Row>
          <ChartModeButton onClick={toggleChartMode}>
            {mode === "EXPANDED" && (
              <ShrinkIcon stroke={theme.colors.gray900} />
            )}
            {mode === "DEFAULT" && <ExpandIcon stroke={theme.colors.gray900} />}
          </ChartModeButton>
        </Heading>

        <Container
          key={mode}
          css={{
            animation: `${fadeIn} 700ms`,
          }}
        >
          {mode === "DEFAULT" && (
            <>
              <Space h={{ _: 12, md: 16 }} />
              <ChartOptionTabs
                values={selectedOptions}
                onChange={onOptionChange}
                optionList={optionsList}
              />
              <ChartVisualizer
                {...chartData[0]}
                {...{ mode, selectedX, setSelectedX }}
              />
            </>
          )}
          {mode === "EXPANDED" &&
            chartData.map((chartData, index) => (
              <ChartVisualizer
                key={index}
                {...chartData}
                {...{
                  mode,
                  selectedX,
                  setSelectedX,
                }}
              />
            ))}
        </Container>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  transition: "300ms",
});

const Content = styled("div", {});

const Heading = styled(Section, {
  rowCenteredY: true,
  defaultVariants: {
    sub: true,
  },
});

const ChartModeButton = styled("div", {
  paddingRight: rem(24),
  paddingLeft: rem(20),
  marginLeft: rem(12),
  cursor: "pointer",
  borderLeft: `${rem(1)} solid rgba($gray900rgb, 0.2)`,

  "& path": {
    stroke: "$gray900",
  },
});

const Box = styled("div", {});

const Container = styled("div", {
  columnCenteredX: true,
  padding: rem(10),
  paddingTop: rem(0),
  "@md": {
    padding: rem(12),
    paddingTop: rem(0),
  },
  variants: {
    test: {
      what: {},
      yo: {},
    },
    tefuckst: {
      1: {},
      2: {},
    },
  },

  defaultVariants: {
    test: "",
  },
});

const LoadingContainer = styled("div", {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  top: 0,
  background: "$whiteA050",
  centered: true,
  zIndex: 1000,

  '&[data-state="show"]': {
    animation: `${fadeIn} 1000ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="hide"]': {
    animation: `${fadeOut} 1000ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

export const ChartSkeleton = ({ tabs }: { tabs: number }) => {
  const { width, height } = useChartSize({ mode: "DEFAULT" });

  return (
    <Wrapper
      css={{
        height: rem(181 + height),
        "@md": {
          height: rem(195 + height),
        },
      }}
    >
      <Section sub>
        <Box
          css={{
            overflow: "hidden",
            transform: `translate(${rem(-1)}, ${rem(-1)})`,
            height: rem(52),
            rowCenteredY: true,
          }}
        >
          {[...Array(tabs)].map((_, index) => (
            <Box
              key={index}
              css={{
                paddingX: rem(12),
                "&:first-of-type": {
                  paddingLeft: rem(20),
                },
                "&:last-of-type": {
                  paddingRight: rem(20),
                },
              }}
            >
              <Skeleton w={{ _: 38, md: 46 }} h={20} />
            </Box>
          ))}
        </Box>
      </Section>

      <Container>
        <Space h={16} />
        <Row css={{ justifyContent: "space-between", width: "100%" }}>
          <Skeleton w={{ _: 180, md: 230 }} h={36} />
          <Skeleton w={{ _: 120, md: 150 }} h={36} />
        </Row>
        <Space h={12} />
        <Row
          css={{
            justifyContent: "flex-end",
            width: "100%",
            paddingRight: rem(42),
            height: rem(42),
            "@md": {
              height: rem(46),
            },
          }}
        >
          <Skeleton w={250} h={{ _: 46, md: 54 }} />
        </Row>
        <Space h={12} />
        <Skeleton w={{ _: "100%", md: 460 }} h={height - 8} />
      </Container>
    </Wrapper>
  );
};

export default Chart;
