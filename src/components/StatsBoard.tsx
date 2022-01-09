import React from "react";

import { rem } from "polished";

import Section from "./Section";
import Stat, { StatColor, StatSkeleton } from "./Stat";

import { styled } from "@styles/stitches.config";

export interface StatsBoardStat {
  label: string;
  color: StatColor;
  value: number | string;
  delta: number;
}

interface Props {
  stats: Array<StatsBoardStat>;
}

const StatsBoard: React.FC<Props> = ({ stats }) => {
  return (
    <Wrapper>
      {stats.map((statProps) => (
        <Stat key={statProps.label} {...statProps} />
      ))}
    </Wrapper>
  );
};

export const StatsBoardSkeleton: React.FC<{ columns: number }> = ({
  columns,
}) => {
  return (
    <Wrapper css={{}}>
      {[...Array(columns)].map((_, index) => (
        <StatSkeleton key={index} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  rowCenteredY: true,
  justifyContent: "space-around",
  paddingY: rem(12),
  paddingX: rem(10),

  "@md": {
    padding: rem(18),
  },
});

export default StatsBoard;
