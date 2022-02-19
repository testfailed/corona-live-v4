import React from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";
import { numberWithCommas } from "@utils/number-util";

import Space from "./Space";
import DeltaTag from "./DeltaTag";
import Skeleton from "./Skeleton";

export type StatColor = "red" | "green" | "blue" | "grey";

interface Props {
  color: StatColor;
  label: string;
  value: number | string;
  delta: number;
}

const Stat: React.FC<Props> = ({ color, label, value, delta }) => {
  return (
    <Wrapper color={color}>
      <Label>{label}</Label>
      <Value>
        {typeof value === "number" ? numberWithCommas(value) : value}
      </Value>
      <DeltaTag delta={delta} color={color} />
    </Wrapper>
  );
};

export const StatSkeleton = () => {
  return (
    <Wrapper>
      <Space h={4} />
      <Label>
        <Skeleton w={32} h={15} />
      </Label>
      <Space h={4} />
      <Value>
        <Skeleton w={80} h={20} />
      </Value>
      <Space h={{ _: 2, md: 4 }} />

      <Skeleton w={60} h={{ _: 16, md: 18 }} />
    </Wrapper>
  );
};

const Label = styled("div", {
  body3: true,

  marginBottom: rem(1),
  color: "$gray900",
  opacity: 0.8,
  whiteSpace: "nowrap",

  "@md": {
    body2: true,
    opacity: 0.9,
  },
});

const Value = styled("div", {
  subtitle1: true,

  marginBottom: rem(3),

  "@md": {
    heading3: true,
    marginBottom: rem(4),
  },
});

const Wrapper = styled("div", {
  columnCenteredX: true,

  variants: {
    color: {
      red: {
        color: "$red500",
      },
      green: {
        color: "$green",
      },
      blue: {
        color: "$blue500",
      },
      grey: {
        color: "$gray900",
      },
    },
  },
});

export default Stat;
