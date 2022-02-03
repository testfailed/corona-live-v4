import React, { useEffect, useMemo, useRef, useState } from "react";

import { rem } from "polished";
import dayjs, { Dayjs } from "dayjs";
import { max, bisector } from "d3-array";
import { transition } from "d3-transition";
import { line, curveLinear } from "d3-shape";
import { select, pointers } from "d3-selection";
import { scaleTime, scaleLinear } from "d3-scale";
import { axisBottom, axisLeft, axisRight } from "d3-axis";

import useChartSize from "@hooks/useChartSize";
import { isArrayEqual } from "@utils/array-util";
import { styled, theme } from "@styles/stitches.config";

import Row from "@components/Row";

import { ChartMode } from "@_types/chart-type";

export type ChartType = "line" | "bar";
export type YAxisPosition = "left" | "right";
export type ChartLineType = "linear" | "cardinal";

export interface ChartConfig {
  type: ChartType;

  lineColor?: string;
  lineThickness?: number;
  lineType?: ChartLineType;

  barColor?: string;
  activeBarColor?: string;
  barThickness?: number;

  showPoints?: boolean;
  pointColor?: string;
  pointRadius?: number;

  legendColor: string;

  showLabel?: boolean;
  labelFormat?: (value: number) => string;

  yAxisPosition: YAxisPosition;

  isStack?: boolean;

  tooltipLabel: string;
  tooltipFormat: (value: number) => string;
  tooltipUnit?: string;

  zIndex?: number;
}

export interface ChartData {
  data: Record<string, number>;
  config: ChartConfig;
}

export interface ChartYAxis {
  id: string;
  position?: YAxisPosition;
  format?: (value: number) => string;
  beginAtZero?: boolean;
  visibility?: "hidden" | "visible";
}

export interface ChartXAxis {
  scaleType: "linear" | "date";
  format: (value: Dayjs | string) => string;
  tooltipFormat: (value: Dayjs | string) => string;
}

export interface ChartVisualizerData {
  dataSet: ChartData[];
  yAxis: { left?: ChartYAxis; right?: ChartYAxis };
  xAxis: ChartXAxis;
}

const TRANSITION_DURATION = 400;
const DEFAULT_CHART_BAR_THICKNESS = 9;

const getYAxisStepSize = (maxY) => {
  let stepSize = `${Math.ceil(maxY / 4)}`;
  let firstDigit = Number(stepSize[0]) + 1;
  let zeros = stepSize.length - 1;

  if (zeros === 0) return Number(stepSize);

  return firstDigit * 10 ** zeros;
};

const getYAxisTickValues = (
  dataSet: ChartData[],
  yAxisPosition: YAxisPosition
) => {
  const currentDataset = dataSet.filter(
    ({ config }) => config.yAxisPosition === yAxisPosition
  );

  const isStack = currentDataset.every(({ config }) => config.isStack);

  let maxY;

  if (isStack) {
    maxY = max(
      Object.keys(currentDataset[0].data).map((date) => {
        let sum = currentDataset.reduce(
          (val, data) => val + data.data[date],
          0
        );
        return sum;
      })
    );
  } else {
    maxY = max(
      currentDataset.reduce(
        (array, data) => [...array, ...Object.values(data.data)],
        []
      )
    );
  }

  const stepSize = getYAxisStepSize(maxY);
  const stepLength = Math.ceil(maxY / stepSize) || 0;
  return [...Array(stepLength + 1)].map((_, i) => i * stepSize);
};

const getXAxisTickValues = (range, xParser) => {
  let ticksInterval =
    range.length < 20
      ? Math.ceil(range.length / (range.length > 8 ? 6 : 8))
      : Math.floor(range.length / (range.length > 8 ? 6 : 8));
  let R = range.length;
  return range.reduce((arr, val, i) => {
    if ((R - i - 1) % ticksInterval === 0) arr.push(xParser(val));
    return arr;
  }, []);
};

interface Props extends ChartVisualizerData {
  mode: ChartMode;
  selectedX: string;
  setSelectedX: React.Dispatch<React.SetStateAction<string>>;
}

const ChartVisualizer: React.FC<Props> = ({
  dataSet,
  xAxis,
  yAxis,
  mode,
  selectedX: parentSelectedX,
  setSelectedX: parentSetSelectedX,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevChartTypes = useRef<Array<ChartType>>([]);

  const [_selectedX, _setSelectedX] = useState<string>(null);

  const { width, height } = useChartSize({ mode });

  const selectedX = mode === "DEFAULT" ? _selectedX : parentSelectedX;
  const setSelectedX = mode === "DEFAULT" ? _setSelectedX : parentSetSelectedX;

  const { xValues, xParser, xScale, yScales, margin } = useMemo(() => {
    let margin = { left: 20, right: 30, top: 16, bottom: 20 };

    if (!dataSet?.[0]) return { margin };

    const xValues = Object.keys(dataSet[0].data);

    const xParser = (value) => {
      return xAxis.scaleType === "date" ? dayjs(value) : value;
    };

    if (yAxis?.left?.visibility === "visible") {
      margin.left = 50;
    }
    if (yAxis?.right?.visibility === "visible") {
      margin.right = 40;
    }

    const xScale = (
      xAxis.scaleType === "date" ? scaleTime().clamp(true) : scaleLinear()
    )
      .domain([xParser(xValues[0]), xParser(xValues[xValues.length - 1])])
      .range([margin.left, width - margin.right]);

    const yScales = (Object.keys(yAxis) as Array<YAxisPosition>).reduce(
      (obj, yAxisPosition) => {
        const tickValues = getYAxisTickValues(dataSet, yAxisPosition);

        let extraPaddingTop = dataSet.some(({ config }) => config.showLabel)
          ? 20
          : 0;
        obj[yAxisPosition] = scaleLinear()
          .domain([0, tickValues[tickValues.length - 1]])
          .range([height - margin.bottom, margin.top + extraPaddingTop]);

        return obj;
      },
      {} as any
    );

    return { xAxis, xValues, xParser, xScale, yScales, margin };
  }, [dataSet, width, height, xAxis, yAxis]);

  useEffect(() => {
    if (xValues) setSelectedX(xValues[xValues.length - 1]);
  }, [setSelectedX, xValues]);

  useEffect(() => {
    if (!dataSet?.[0] || width === undefined || height === undefined) return;

    const $svg = select(svgRef.current);
    const $container = select(containerRef.current);

    const t = transition().duration(TRANSITION_DURATION);
    ($svg as any)?.transition();

    const chartTypes = dataSet.map(({ config }) => config.type);
    const shouldRepaintSvg =
      prevChartTypes.current.length !== 0 &&
      isArrayEqual(prevChartTypes.current, chartTypes) === false;

    if (shouldRepaintSvg) {
      prevChartTypes.current.map((_, i) => {
        const group = $svg.select(`.group-${i}`);
        group.selectAll(`.area-${i}`).remove();
        group.selectAll(".bar").remove();
        group.selectAll(`.points-${i}`).remove();
        group.remove();
      });
    }

    prevChartTypes.current = chartTypes;

    const drawAxis = () => {
      const drawYAxis = () => {
        (Object.keys(yAxis) as Array<YAxisPosition>).forEach(
          (yAxisPosition) => {
            const { format, visibility } = yAxis[yAxisPosition];
            const isLeft = yAxisPosition === "left";
            const yAxisClassname = isLeft ? ".y-axis-left" : ".y-axis";

            if (visibility === "visible") {
              const yScale = yScales[yAxisPosition];
              const tickValues = getYAxisTickValues(dataSet, yAxisPosition);

              const yAxisTranslateX = isLeft
                ? margin.left
                : width - margin.right;

              const tickX = isLeft ? -36 : 40;

              const yAxisGenerator = (
                isLeft ? axisRight(yScale) : axisLeft(yScale)
              )
                .tickSize(width - margin.left - margin.right)
                .tickValues(tickValues)
                .tickFormat(format);

              $svg
                .select(yAxisClassname)
                .attr("opacity", 1)
                .attr("transform", `translate(${yAxisTranslateX}, 0)`)
                .call((g) =>
                  g
                    .call(yAxisGenerator)
                    .call((g) =>
                      g
                        .selectAll(".tick:first-of-type line")
                        .attr("stroke-opacity", isLeft ? 0 : 0.08)
                    )
                    .call((g) =>
                      g
                        .selectAll(".tick:not(:first-of-type) line")
                        .attr("stroke-opacity", isLeft ? 0 : 0.08)
                    )
                    .call((g) =>
                      g.selectAll(".tick text").attr("x", tickX).attr("dy", 4)
                    )
                );
            } else {
              $svg.select(yAxisClassname).attr("opacity", 0);
            }
          }
        );
      };

      const drawXAxis = () => {
        $svg
          .select(".x-axis")
          .attr("transform", `translate(0, ${height - margin.bottom})`)
          .call((g) =>
            g
              .attr("class", "x-axis")
              .call(
                axisBottom()
                  .scale(xScale)
                  .tickValues(getXAxisTickValues(xValues, xParser))
                  .tickFormat(xAxis.format)
              )
          );
      };

      drawYAxis();
      drawXAxis();
    };
    drawAxis();

    dataSet.map(({ data, config }, i) => {
      const { type, showPoints, isStack, zIndex, yAxisPosition } = config;
      const yScale = yScales[yAxisPosition];

      const groupClassName = `group-${i}`;
      let group = $svg
        .select(`.${groupClassName}`)
        .style("z-index", zIndex ?? 1);

      const shouldInitGroup = (group as any)._groups[0][0] === undefined;
      if (shouldInitGroup) {
        $svg.append("g").attr("class", groupClassName);
        group = $svg.select(`.${groupClassName}`).style("z-index", zIndex ?? 1);
      }

      const drawChart = () => {
        const drawLabel = () => {
          const { showLabel, labelFormat } = config;
          if (showLabel) {
            const labelTop = (x) => {
              if (isStack) {
                return (
                  yScale(
                    dataSet
                      .filter(({ config }) => config.isStack)
                      .reduce((total, { data }) => total + data[x], 0)
                  ) - 10
                );
              } else {
                return yScale(data[x]) - 10;
              }
            };

            const labelValue = (x) => {
              let value;
              if (isStack) {
                value = dataSet
                  .filter(({ config }) => config.isStack)
                  .reduce((total, { data }) => total + data[x], 0);
              } else {
                value = data[x];
              }
              return labelFormat ? labelFormat(value) : value;
            };

            group
              .selectAll(".label-background")
              .data(xValues)
              .join((enter) =>
                enter
                  .append("rect")
                  .attr("class", `bar`)
                  .attr("width", 10)
                  .attr("height", 16)
                  .attr("fill", theme.colors.white)
                  .attr("class", "label-background")
                  .attr("x", (x) => xScale(xParser(x)))
                  .attr("y", labelTop)
              )
              .attr("width", 10)
              .attr("height", 16)
              .attr("fill", theme.colors.white)
              .attr("class", "label-background")
              .attr("x", (x) => xScale(xParser(x)) - 5)
              .attr("y", (x) => labelTop(x) - 12);

            group
              .selectAll(".label")
              .data(xValues)
              .join((enter) =>
                enter
                  .append("text")
                  .text(labelValue)
                  .attr("class", "label")
                  .attr("text-anchor", "middle")
                  .attr("x", (x) => xScale(xParser(x)))
                  .attr("y", labelTop)
              )
              .transition(t)
              .text(labelValue)
              .attr("x", (x) => xScale(xParser(x)))
              .attr("y", labelTop);
          } else {
            group.selectAll(".label").remove();
            group.selectAll(".label-background").remove();
          }
        };
        drawLabel();

        const drawBars = () => {
          const { activeBarColor, barColor } = config;

          const barThickness = Number(
            Math.min(
              DEFAULT_CHART_BAR_THICKNESS,
              (width / xValues.length) * 0.5
            ).toFixed(2)
          );

          const barHeight = (x) => {
            const value = height - margin.bottom - yScale(data[x]);

            return value;
          };

          const barLeft = (x) => {
            const value = xScale(xParser(x)) - barThickness / 2;

            return value;
          };

          const barTop = (x) => {
            let value;
            if (isStack && i > 0) {
              value =
                yScale(dataSet[0].data[x]) -
                dataSet
                  .slice(1, i + 1)
                  .reduce(
                    (sum, { data: _data }) =>
                      sum + (height - margin.bottom - yScale(_data[x])),
                    0
                  );
            } else {
              value = yScale(data[x]);
            }
            return value;
          };

          group
            .selectAll(".bar")
            .data(xValues)
            .join((enter) =>
              enter
                .append("rect")
                .attr("class", `bar`)
                .attr("width", barThickness)
                .attr("height", barHeight)
                .attr("fill", (x) => {
                  return selectedX === x ? activeBarColor : barColor;
                })
                .attr("opacity", (x) => (selectedX === x ? 1 : 0.6))
                .attr("x", barLeft)
                .attr("y", (x) => barTop(x))
                .attr("rx", barThickness / 2.2)
                .attr("ry", barThickness / 2.2)
            )
            .transition(t)
            .attr("width", barThickness)
            .attr("height", (x) => height - margin.bottom - yScale(data[x]))
            .attr("fill", (x) => (selectedX === x ? activeBarColor : barColor))
            .attr("opacity", (x) => (selectedX === x ? 1 : 0.6))
            .attr("x", barLeft)
            .attr("y", (x) => barTop(x));
        };

        const drawLines = () => {
          const { lineThickness, lineColor } = config;

          const linePath = line()
            .curve(curveLinear)
            .x((x) => xScale(xParser(x)))
            .y((x) => yScale(data[x]));

          const mainGradient = group
            .selectAll(`defs-${i}`)
            .data([0])
            .enter()
            .append("defs")
            .attr("id", `defs-${i}`)
            .append("linearGradient")
            .attr("id", `mainGradient-${i}`)
            .attr("x2", "0%")
            .attr("y2", "100%");

          const color = (lineColor as any).token.match(/[^\d]+/)[0];

          mainGradient
            .append("stop")
            .attr("style", `stop-color:${theme.colors[`${color}A050`]}`)
            .attr("offset", "0");

          mainGradient
            .append("stop")
            .attr("style", `stop-color:${theme.colors[`${color}A000`]}`)
            .attr("offset", "0.3");
          mainGradient
            .append("stop")
            .attr("style", `stop-color:${theme.colors[`${color}A000`]}`)
            .attr("offset", "1");

          const extraX = width * 3;
          const extraY = height * 3;

          group
            .selectAll(`.area-${i}`)
            .data([xValues])
            .join(
              (enter) =>
                enter
                  .append("path")
                  .attr("class", `area-${i}`)
                  .attr("stroke", lineColor)
                  .attr("strokeWidth", lineThickness)
                  .attr("clip-path", `url(#maskClipPath)`)
                  .attr("d", (a) => {
                    return (
                      linePath(a) +
                      `L ${extraX} 0 L ${extraX} ${extraY} L -${extraY} ${extraY}`
                    );
                  })
                  .attr("fill", `url(#mainGradient-${i})`),
              (update) =>
                update.transition(t).attr("d", (a) => {
                  return (
                    linePath(a) +
                    `L ${extraX} 0 L ${extraX} ${extraY} L -${extraY} ${extraY}`
                  );
                })
            );
        };

        const drawPoints = () => {
          const { pointRadius, pointColor } = config;

          group
            .selectAll(`.points-${i}`)
            .data(xValues)
            .join(
              (enter) =>
                enter
                  .append("circle")
                  .attr("class", `points-${i}`)
                  .attr("fill", pointColor)
                  .attr("r", pointRadius)
                  .attr("cx", (x) => xScale(xParser(x)))
                  .attr("cy", (x) => yScale(data[x])),

              (update) =>
                update
                  .transition(t)
                  .attr("cx", (x) => xScale(xParser(x)))
                  .attr("cy", (x) => yScale(data[x]))
            );
        };

        if (type === "bar") drawBars();
        if (type === "line") drawLines();
        if (showPoints) drawPoints();
      };
      drawChart();
    });

    function mousemove(event) {
      const xm = pointers(event)[0][0];

      const x = xScale.invert(xm);

      if (!isNaN(x)) {
        const bisectDate = bisector((x) => xParser(x)).left;
        const index = bisectDate(xValues, x, 1);
        const xLeft = xValues[index - 1];
        const xRight = xValues[index];
        const selectedX =
          x - xParser(xLeft) < xParser(xRight) - x ? xLeft : xRight;
        setSelectedX((prevX) => selectedX || prevX);
      }
    }

    $container.selectAll("*").attr("pointer-events", "none");
    $container.on("mousemove", mousemove).on("touchmove", mousemove);
  }, [svgRef, dataSet, yScales]);

  useEffect(() => {
    if (!dataSet?.[0]) return;

    const t = transition().duration(TRANSITION_DURATION);

    const $svg = select(svgRef.current);
    const $container = select(containerRef.current);

    const chartTooltipContainer = $container.select(".chart-tooltip-container");
    const tooltipLine = $container.select(".chart-tooltip-line");
    const tooltipDate = $container.select(".chart-tooltip-date");

    if (xScale(xParser(selectedX)) === undefined) {
      chartTooltipContainer.style("opacity", 0);
      tooltipLine.style("opacity", 0);
      tooltipDate.style("opacity", 0);

      return;
    }

    const updateTooltip = () => {
      const { width: containerWidth, height: containerHeight } =
        chartTooltipContainer.node().getBoundingClientRect();
      let translateX = xScale(xParser(selectedX)) - containerWidth / 2;
      if (translateX < 0) {
        translateX = 0;
      } else if (translateX + containerWidth > width - margin.right + 10) {
        translateX = width - margin.right - containerWidth + 10;
      }

      chartTooltipContainer.style("opacity", 1).style("left", rem(translateX));

      tooltipLine
        .style("opacity", 1)
        .style("left", rem(xScale(xParser(selectedX))))
        .style("top", rem(containerHeight))
        .style("height", rem(height - 18));
    };
    updateTooltip();

    dataSet.forEach(({ data, config }, i) => {
      const yScale = yScales[config.yAxisPosition];

      const groupClassName = `group-${i}`;
      let group = $svg.select(`.${groupClassName}`);

      const { showPoints, type, isStack } = config;

      const drawPoints = () => {
        const { pointColor, pointRadius, lineColor } = config;

        const color = (pointColor as any).token.match(/[^\d]+/)[0];

        group
          .selectAll(`.points-${i}-box-shadow`)
          .data(xValues)
          .join(
            (enter) =>
              enter
                .append("circle")
                .attr("class", `points-${i}-box-shadow`)
                .attr("fill", pointColor)
                .attr("r", showPoints ? pointRadius : 4)
                .attr("stroke", theme.colors[`${color}A050`].computedValue)
                .attr("stroke-width", showPoints ? pointRadius * 3 : 10)
                .attr("opacity", (x) => (x === selectedX ? 1 : 0))

                .attr("cx", (x) => xScale(xParser(x)))
                .attr("cy", (x) => yScale(data[x])),
            (update) =>
              update
                .attr("cx", (x) => xScale(xParser(x)))
                .attr("cy", (x) => yScale(data[x]))
                .attr("opacity", (x) => (x === selectedX ? 1 : 0))
          );
      };

      const drawBars = () => {
        const { activeBarColor, barColor } = config;

        const barThickness = Number(
          Math.min(
            DEFAULT_CHART_BAR_THICKNESS,
            (width / xValues.length) * 0.5
          ).toFixed(2)
        );

        const barHeight = (x) => {
          const value = height - margin.bottom - yScale(data[x]);

          return value;
        };

        const barLeft = (x) => {
          const value = xScale(xParser(x)) - barThickness / 2;

          return value;
        };

        const barTop = (x) => {
          let value;
          if (isStack && i > 0) {
            value =
              yScale(dataSet[0].data[x]) -
              dataSet
                .slice(1, i + 1)
                .reduce(
                  (sum, { data: _data }) =>
                    sum + (height - margin.bottom - yScale(_data[x])),
                  0
                );
          } else {
            value = yScale(data[x]);
          }
          return value;
        };

        group
          .selectAll(".bar")
          .data(xValues)
          .join((enter) =>
            enter
              .append("rect")
              .attr("class", `bar`)
              .attr("width", barThickness)
              .attr("height", barHeight)
              .attr("fill", (x) => {
                return selectedX === x ? activeBarColor : barColor;
              })
              .attr("opacity", (x) => (selectedX === x ? 1 : 0.6))
              .attr("x", barLeft)
              .attr("y", (x) => barTop(x))
              .attr("rx", barThickness / 2.2)
              .attr("ry", barThickness / 2.2)
          )
          .attr("opacity", (x) => (selectedX === x ? 1 : 0.6))
          .transition(t)
          .attr("width", barThickness)
          .attr("height", (x) => height - margin.bottom - yScale(data[x]))
          .attr("fill", (x) => (selectedX === x ? activeBarColor : barColor))
          .attr("x", barLeft)
          .attr("y", (x) => barTop(x));
      };

      if (type === "line") drawPoints();
      if (type === "bar") drawBars();
    });
  }, [svgRef, selectedX, yScales]);

  const xValue = xParser ? xScale(xParser(selectedX)) : 0;
  const xLabelValue = xAxis?.tooltipFormat(
    xAxis.scaleType === "linear" && selectedX === xValues[xValues.length - 1]
      ? "현재"
      : xParser(selectedX)
  );

  return (
    <div ref={containerRef}>
      <Wrapper>
        <TooltipContainer
          className="chart-tooltip-container"
          css={{
            visibility: xValue === undefined ? "hidden" : "visible",
          }}
        >
          <TooltipLabel>{xLabelValue}</TooltipLabel>
          <Row>
            {dataSet &&
              dataSet.map(({ config, data }) =>
                config.tooltipLabel !== null ? (
                  <ToolTipValue
                    key={config.tooltipLabel}
                    css={{
                      "--tooltip-value-color":
                        config.barColor ?? config.lineColor,
                      "--tooltip-value-color-opacity": `${
                        config.barColor ?? config.lineColor
                      }50`,
                    }}
                  >
                    <span>{config.tooltipLabel}</span>
                    <div>
                      {config.tooltipFormat(data[selectedX])}
                      {config?.tooltipUnit && (
                        <span>{config?.tooltipUnit}</span>
                      )}
                    </div>
                  </ToolTipValue>
                ) : (
                  <></>
                )
              )}
          </Row>
        </TooltipContainer>

        <TooltipLine className="chart-tooltip-line" />

        <svg
          ref={svgRef}
          viewBox={`0 0 ${width ?? 0} ${height ?? 0}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ width: rem(width), height: rem(height) }}
        >
          <g className="x-axis"></g>
          <g className="y-axis"></g>
          <g className="y-axis-left"></g>
          <defs>
            <clipPath id={`maskClipPath`}>
              <rect
                height={Number(height - margin.top - margin.bottom + 2) || 0}
                width={Number(width - margin.left - margin.right) || 0}
                x={margin.left}
                y={margin.top}
              ></rect>
            </clipPath>
          </defs>
        </svg>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  zIndex: 1,

  "& text": {
    body3: true,

    fill: "$gray800",
    letterSpacing: rem(-0.5),
    position: "relative",
  },

  "& .label": {
    zIndex: 100,
  },

  "& .label-background": {
    zIndex: 0,
  },

  "& .x-axis": {
    "& text": {
      fill: "$gray900",
      body3: true,

      "@md": {
        body2: true,
      },
    },
    "& > .domain, line": {
      visibility: "hidden",
    },
  },

  "& .y-axis": {
    "& > .domain": {
      visibility: "hidden",
    },
  },

  "& .y-axis-left": {
    "& > .domain": {
      visibility: "hidden",
    },
  },

  "& svg, g, path, rect": {
    zIndex: 2,
  },
});

const TooltipContainer = styled("div", {
  height: rem(50),
  marginTop: rem(12),
  marginBottom: rem(2),
  background: "$shadowBackground1",
  width: "fit-content",
  column: true,
  position: "relative",
  borderRadius: rem(12),
  boxShadow: `${rem(-1)} ${rem(1)} ${rem(12)} ${rem(-2)} #0000001f`,
  overflow: "hidden",
  paddingX: rem(12),
  paddingY: rem(6),

  "@md": {
    height: rem(54),
    marginTop: rem(16),
    border: `${rem(1)} solid $sectionBorder`,
  },
});

const TooltipLabel = styled("div", {
  body3: true,

  fontWeight: 500,
});

const ToolTipValue = styled("div", {
  rowCenteredY: true,
  marginRight: rem(8),

  "&:before": {
    content: "",
    background: "var(--tooltip-value-color)",
    display: "flex",
    marginRight: rem(6),
    height: rem(8),
    width: rem(8),
    borderRadius: rem(3),
  },

  "& > span": {
    body1: true,

    rowCenteredY: true,
    marginRight: rem(4),
  },

  "& > div": {
    subtitle2: true,

    "& > span": {
      fontWeight: 400,
    },
  },

  "@md": {
    "& > div": {
      subtitle1: true,
    },
  },

  "&:last-of-type": {
    marginRight: 0,
  },
});

const TooltipLine = styled("div", {
  position: "absolute",
  width: rem(0),
  borderLeft: `${rem(2)} dotted $gray500`,
  transform: `translate(${rem(-1)},0)`,
  zIndex: -1,
});

export default ChartVisualizer;
