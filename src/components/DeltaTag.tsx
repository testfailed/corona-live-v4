import React, { useMemo } from "react";

import { opacify, rem, rgba } from "polished";

import { styled, theme } from "@styles/stitches.config";
import { numberSign, numberWithCommas } from "@utils/number-util";

import { StatColor } from "./Stat";
import { ArrowDownIcon, ArrowUpIcon } from "./icon/Icon_Arrow";

interface Props {
  delta: number;
  color?: StatColor;
  small?: boolean;
}

const DeltaTag: React.FC<Props> = ({ delta, color, small }) => {
  const deltaSign = numberSign(delta);

  const defaultColor = useMemo((): StatColor => {
    switch (deltaSign) {
      case "+":
        return "red";

      case "-":
        return "blue";

      case "":
      default:
        return "grey";
    }
  }, [deltaSign]);

  return (
    <Wrapper color={color ?? defaultColor}>
      {delta !== 0 ? (
        <>
          <Value small={small}>{numberWithCommas(Math.abs(delta))}</Value>
          {deltaSign === "+" && <ArrowUpIcon />}
          {deltaSign === "-" && <ArrowDownIcon />}
        </>
      ) : (
        <Value>-</Value>
      )}
    </Wrapper>
  );
};

DeltaTag.toString = () => "." + Wrapper.className;

const Wrapper = styled("div", {
  rowCenteredY: true,
  paddingRight: rem(6),
  paddingLeft: rem(6),
  borderRadius: rem(50),
  paddingY: rem(1.5),

  variants: {
    color: {
      red: {
        color: "$red500",
        background: "$red100",
        "& svg": {
          stroke: "$red500",
        },
      },
      green: {
        color: "$green",
        background: "$greenBg",
        "& svg": {
          stroke: "$green",
        },
      },
      blue: {
        color: "$blue500",
        background: "$blue100",
        "& svg": {
          stroke: "$blue500",
        },
      },
      grey: {
        color: `rgba(${theme.colors.gray900rgb}, 0.8)`,
        // color: "$gray800",
        background: `${theme.colors.gray700.value}20`,
        "& svg": {
          stroke: `rgba(${theme.colors.gray900rgb}, 0.8)`,
        },
      },
    },
  },
});

const Value = styled("div", {
  body3: true,

  fontWeight: 700,
  marginX: rem(2),
  color: "inherit",
  transform: `translateY(${rem(-0.5)})`,

  "@md": {
    subtitle3: true,
  },

  variants: {
    small: {
      true: {
        caption1: true,

        "@md": {
          body3: true,
        },
      },
    },
  },
});

export default DeltaTag;
