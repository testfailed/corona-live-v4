import React, { useEffect, useReducer, useRef, useState } from "react";

import { rem } from "polished";
import { Presence } from "@radix-ui/react-presence";

import { styled, theme } from "@styles/stitches.config";
import { fadeIn, fadeOut } from "@styles/animations/fade-animation";

import useChartSize from "@hooks/useChartSize";
import useUpdateEffect from "@hooks/useUpdatedEffect";
import useDebounceState from "@hooks/useDebounceState";
import { useLocalStorage } from "@hooks/useLocalStorage";

import ChartVisualiser from "./Chart_Visualiser";
import ChartSubOptions from "./Chart_SubOptions";
import ChartMainOptions from "./Chart_MainOptions";

import Row from "@components/Row";
import Space from "@components/Space";
import Loader from "@components/Loader";
import Tooltip from "@components/Tooltip";
import RenderIf from "@components/RenderIf";
import Skeleton from "@components/Skeleton";
import { SubSection } from "@components/Section";
import RenderSwitch from "@components/RenderSwitch";
import ExpandIcon from "@components/icon/Icon_Expand";

import type { ChartMode, ChartProps } from "@features/chart/chart-type";
import useChartReducer from "../hooks/useChartReducer";

const Chart = <MainOption extends string, SubOption extends string>(
  props: ChartProps<MainOption, SubOption>
) => {
  const {
    chartOptions,
    getChartData,
    forceUpdate,
    enableExpandMode = false,
  } = props;

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
  ] = useChartReducer<MainOption, SubOption>(props);

  const contentRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState(_mode);
  const [selectedX, setSelectedX] = useState<string>(null);
  const [isLoading, setIsLoading] = useDebounceState(false);
  const [wrapperHeight, setWrapperHeight] = useState("auto");

  const [seenChartModeTooltip, setSeenChartModeTooltip] = useLocalStorage(
    "seen-chart-mode-tooltip",
    false
  );

  const [showTooltip, setShowTooltip] = useState(
    seenChartModeTooltip === false
  );

  useEffect(() => {
    dispatch({ type: "INIT", payload: { props } });
  }, [chartOptions]);

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
    dispatch({ type: "CHANGE_SUB_OPTION", payload: { optionName, value } });
  };

  const onStatChange = (value: MainOption) => {
    dispatch({ type: "CHANGE_MAIN_OPTION", payload: { value } });
  };

  const toggleChartMode = async () => {
    setSeenChartModeTooltip(true);
    setShowTooltip(false);
    dispatch({ type: "TOGGLE_MODE" });
    await updateChartData();
  };

  useEffect(() => {
    if ((_mode === "EXPANDED" && chartData.length > 1) || _mode === "DEFAULT") {
      setTimeout(() => {
        const { height } = contentRef.current.getBoundingClientRect();
        if (height) setWrapperHeight(rem(height));
      }, 0);
      setMode(_mode);
    }
  }, [_mode, chartData]);

  const chartVisualiserProps = { mode, selectedX, setSelectedX };

  return (
    <Wrapper
      style={{
        height: wrapperHeight,
      }}
    >
      <Content ref={contentRef}>
        <Presence present={isLoading}>
          <LoadingContainer data-state={isLoading ? "show" : "hide"}>
            <Loader />
          </LoadingContainer>
        </Presence>

        <ChartHeadingContainer>
          <Row centeredY css={{ flex: 1 }}>
            <RenderSwitch
              value={mode}
              cases={{
                DEFAULT: (
                  <ChartMainOptions
                    value={selectedMainOption as any}
                    onChange={onStatChange}
                    mainOptions={mainOptions}
                  />
                ),
                EXPANDED: (
                  <Row css={{ paddingY: rem(8), paddingX: rem(8), flex: 1 }}>
                    <ChartSubOptions
                      values={selectedSubOptions}
                      onChange={onOptionChange}
                      subOptions={subOptions}
                    />
                  </Row>
                ),
              }}
            />
          </Row>

          {enableExpandMode && (
            <ChartModeButtonContainer>
              <RenderIf condition={_mode === "DEFAULT"}>
                <ChartHeadingDivider />
              </RenderIf>
              <ChartModeButton onClick={toggleChartMode}>
                <Tooltip
                  show={showTooltip}
                  content={_mode === "EXPANDED" ? "하나씩 보기" : "한눈에 보기"}
                >
                  <ExpandIcon
                    stroke={theme.colors.gray900}
                    expanded={_mode === "EXPANDED"}
                  />
                </Tooltip>
              </ChartModeButton>
            </ChartModeButtonContainer>
          )}
        </ChartHeadingContainer>

        <ChartVisualiserContainer>
          <RenderIf condition={mode === "DEFAULT"}>
            <Space h={{ _: 12, md: 16 }} />
            <ChartSubOptions
              values={selectedSubOptions}
              onChange={onOptionChange}
              subOptions={subOptions}
            />
          </RenderIf>

          <FadeInAnimationContainer key={mode}>
            <RenderSwitch
              value={mode}
              cases={{
                DEFAULT: (
                  <ChartVisualiser
                    {...chartData[0]}
                    {...chartVisualiserProps}
                  />
                ),
                EXPANDED: chartData.map((data, index) => (
                  <ChartVisualiser
                    key={index}
                    {...data}
                    {...chartVisualiserProps}
                    lastIndex={index === chartData.length - 1}
                  />
                )),
              }}
            />
          </FadeInAnimationContainer>
        </ChartVisualiserContainer>
      </Content>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  transition: "300ms ease 0s",
});

const Content = styled("div", {});

const ChartHeadingContainer = styled(SubSection, {
  rowCenteredY: true,
});

const ChartHeadingDivider = styled("div", {
  height: "100%",
  position: "absolute",
  right: "101%",
  bottom: 0,
  top: 0,
  width: rem(36),
  background: `linear-gradient(to left, $whiteA100 25%, $whiteA000)`,
  "&": {
    backgroundImage: `-webkit-linear-gradient(to left, $whiteA100 25%, $whiteA000)`,
  },
  zIndex: 1,
});

const ChartModeButtonContainer = styled("div", {
  position: "relative",

  marginLeft: rem(2),
  borderLeft: `${rem(1)} solid rgba($gray900rgb, 0.2)`,

  "& path": {
    stroke: "$gray900",
  },

  variants: {
    leftFadeOut: {
      true: {
        "&:before": {
          content: "",
          height: "100%",
          position: "absolute",
          right: "101%",
          bottom: 0,
          top: 0,
          width: rem(36),
          background: `linear-gradient(to left, ${theme.colors.white.computedValue} 25%, transparent)`,
          zIndex: 1,
        },
      },
    },
  },
});

const ChartModeButton = styled("div", {
  paddingRight: rem(24),
  paddingLeft: rem(20),
  "&, & *": {
    cursor: "pointer",
  },
});

const Box = styled("div", {});

const ChartVisualiserContainer = styled("div", {
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

const FadeInAnimationContainer = styled("div", {
  animation: `${fadeIn} 500ms ease 0s`,
});

export const ChartSkeleton = ({
  tabs,
}: {
  tabs: number;
  mode?: ChartMode;
  charts?: number;
}) => {
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

      <ChartVisualiserContainer>
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
      </ChartVisualiserContainer>
    </Wrapper>
  );
};

export default Chart;
