import React, { useEffect, useReducer, useRef, useState } from "react";

import { rem } from "polished";
import { Presence } from "@radix-ui/react-presence";

import { styled, theme } from "@styles/stitches.config";
import { fadeIn, fadeOut } from "@styles/animations/fade-animation";
import { chartRangeOptions, chartTypeOptions } from "@utils/chart-util";
import { formatObjectValues, removeNullFromObject } from "@utils/object-util";

import useChartSize from "@hooks/useChartSize";
import useUpdateEffect from "@hooks/useUpdatedEffect";
import useDebounceState from "@hooks/useDebounceState";

import ChartMainOptions from "./Chart_MainOptions";
import ChartVisualizer from "./Chart_Visualizer";
import ChartSubOptions from "./Chart_SubOptions";

import Row from "@components/Row";
import Space from "@components/Space";
import Loader from "@components/Loader";
import { SubSection } from "@components/Section";
import Skeleton from "@components/Skeleton";
import { TabProps } from "@components/Tabs";
import ExpandIcon from "@components/icon/Icon_Expand";

import type { ChartMode } from "@_types/chart-type";
import type { ChartStatOptions } from "@_types/chart-type";
import type { ChartVisualizerData } from "./Chart_Visualizer";

const getInitialSelectedSubOptions = <
  MainOption extends string,
  SubOption extends string
>(
  chartStatOptions: ChartStatOptions<MainOption, SubOption>,
  defaultMode?: ChartMode
) => {
  const stat = Object.keys(chartStatOptions)[0] as MainOption;
  const { options } = chartStatOptions[stat];
  const defaultOptions = chartStatOptions[stat]?.defaultOptions;

  if (defaultMode === "EXPANDED") {
    return {
      type: "daily",
      range: "oneMonth",
    };
  }

  return formatObjectValues(
    removeNullFromObject(options),
    (optionValuesObj, optionName) => {
      if (optionValuesObj === null) return null;
      const optionValueNames = Object.keys(optionValuesObj).filter(
        (optionValue) => optionValuesObj[optionValue].disabled !== true
      );
      return defaultOptions?.[optionName] ?? optionValueNames[0];
    }
  ) as Record<SubOption, string>;
};

interface ReducerState<MainOption extends string, SubOption extends string> {
  props: Props<MainOption, SubOption>;
  mode: ChartMode;
  chartData: Array<ChartVisualizerData>;
  selectedMainOption: MainOption;
  selectedSubOptions: Record<SubOption, string>;
  subOptions: Record<SubOption, Array<TabProps>>;
  mainOptions: Array<TabProps>;
}

type ReducerAction<MainOption extends string, SubOption extends string> =
  | { type: "INIT" }
  | { type: "TOGGLE_MODE" }
  | { type: "UPDATE_OPTIONS_LIST" }
  | { type: "UPDATE_SELECTED_OPTIONS" }
  | {
      type: "SET_CHART_DATA";
      payload: { chartData: Array<ChartVisualizerData> };
    }
  | { type: "CHANGE_OPTION"; payload: { optionName: string; value: SubOption } }
  | { type: "CHANGE_STAT"; payload: { value: MainOption } };

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
            newMode
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

      case "CHANGE_OPTION":
        return {
          ...state,
          selectedSubOptions: getSelectedSubOptions({
            ...state.selectedSubOptions,
            [action.payload.optionName]: action.payload.value,
          }),
        };

      case "CHANGE_STAT":
        return { ...state, selectedMainOption: action.payload.value };

      case "INIT":
        return {
          ...state,
          subOptions: getSubOptions(
            getInitialSelectedSubOptions(state.props.chartStatOptions)
          ),
          mainOptions: Object.keys(state.props.chartStatOptions).map(
            (stat) => ({
              value: stat,
              text: state.props.chartStatOptions[stat].label,
            })
          ),
        };

      default:
        throw new Error();
    }

    function getSelectedSubOptions(prevselectedSubOptions) {
      const { selectedMainOption, props } = state;
      const { chartStatOptions } = props;
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
            chartStatOptions[selectedMainOption]?.defaultOptions;

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
      mode?: ChartMode
    ) {
      const { props, selectedMainOption } = state;
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
        ) as Record<SubOption, Array<TabProps>>;
      };

      if ((mode ?? state?.mode) === "EXPANDED") {
        return transformOptionsList({
          type: chartTypeOptions({ omit: ["accumulated", "live", "monthly"] }),
          range: chartRangeOptions({ omit: ["all"] }),
        });
      }

      const { options: _options } = chartStatOptions[selectedMainOption];
      const options = _options;
      const overrideOptionsIf =
        chartStatOptions[selectedMainOption]?.overrideOptionsIf;

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
  props: Props<MainOption, SubOption>
): ReducerState<MainOption, SubOption> => {
  const { chartStatOptions, defaultMode } = props;
  const stats = Object.keys(chartStatOptions) as MainOption[];
  const selectedSubOptions = getInitialSelectedSubOptions(
    chartStatOptions,
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

interface Props<MainOption extends string, SubOption extends string> {
  chartStatOptions: ChartStatOptions<MainOption, SubOption>;
  getChartData: (
    selectedMainOption: MainOption,
    selectedSubOptions: Record<SubOption, string>,
    mode: ChartMode
  ) => Promise<Array<ChartVisualizerData>>;
  forceUpdate?: any;
  enableExpandMode?: boolean;
  defaultMode?: ChartMode;
}

const Chart = <MainOption extends string, SubOption extends string>(
  props: Props<MainOption, SubOption>
) => {
  const {
    chartStatOptions,
    getChartData,
    forceUpdate,
    enableExpandMode = false,
    defaultMode = "DEFAULT",
  } = props;

  const reducer = createReducer<MainOption, SubOption>();
  const [
    {
      chartData,
      mainOptions,
      subOptions,
      selectedSubOptions,
      selectedMainOption,
      mode: _mode,
    },
    dispatch,
  ] = useReducer(reducer, null, () => initReducerState(props));

  const contentRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState(_mode);
  const [selectedX, setSelectedX] = useState<string>(null);
  const [isLoading, setIsLoading] = useDebounceState(false);
  const [wrapperHeight, setWrapperHeight] = useState("auto");

  useEffect(() => {
    dispatch({ type: "INIT" });
  }, [chartStatOptions]);

  useUpdateEffect(() => {
    dispatch({ type: "UPDATE_OPTIONS_LIST" });
  }, [selectedMainOption, selectedSubOptions]);

  useEffect(() => {
    dispatch({ type: "UPDATE_SELECTED_OPTIONS" });
  }, [selectedMainOption]);

  const updateChartData = async () => {
    setIsLoading(true);
    const chartData = await getChartData(
      selectedMainOption,
      selectedSubOptions,
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
  }, [selectedMainOption, selectedSubOptions, forceUpdate]);

  const onOptionChange = (optionName: string, value: SubOption) => {
    dispatch({ type: "CHANGE_OPTION", payload: { optionName, value } });
  };

  const onStatChange = (value: MainOption) => {
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
              <ChartMainOptions
                value={selectedMainOption as any}
                onChange={onStatChange}
                mainOptions={mainOptions}
              />
            )}
            {mode === "EXPANDED" && (
              <Row css={{ paddingY: rem(8), paddingX: rem(8), flex: 1 }}>
                <ChartSubOptions
                  values={selectedSubOptions}
                  onChange={onOptionChange}
                  subOptions={subOptions}
                />
              </Row>
            )}
          </Row>
          {enableExpandMode && (
            <ChartModeButton>
              <ExpandIcon
                onClick={toggleChartMode}
                stroke={theme.colors.gray900}
                expanded={_mode === "EXPANDED"}
              />
            </ChartModeButton>
          )}
        </Heading>
        <Container>
          {mode === "DEFAULT" && (
            <>
              <Space h={{ _: 12, md: 16 }} />
              <ChartSubOptions
                values={selectedSubOptions}
                onChange={onOptionChange}
                subOptions={subOptions}
              />
            </>
          )}
          <div
            key={mode}
            style={{
              animation: `${fadeIn} 500ms ease 0s`,
            }}
          >
            {mode === "DEFAULT" && (
              <>
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
          </div>
        </Container>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  transition: "300ms ease 0s",
});

const Content = styled("div", {});

const Heading = styled(SubSection, {
  rowCenteredY: true,
});

const ChartModeButton = styled("div", {
  position: "relative",
  paddingRight: rem(24),
  paddingLeft: rem(20),
  marginLeft: rem(2),
  cursor: "pointer",
  borderLeft: `${rem(1)} solid rgba($gray900rgb, 0.2)`,

  "& path": {
    stroke: "$gray900",
  },

  // "&:before": {
  //   content: "",
  //   height: "100%",
  //   position: "absolute",
  //   right: "101%",
  //   bottom: 0,
  //   top: 0,
  //   width: rem(36),
  //   background: "linear-gradient(to left, white 25%, transparent)",
  //   zIndex: 1,
  // },
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
      <SubSection>
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
      </SubSection>

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
