import React, { useEffect, useMemo, useState } from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";
import { numberWithCommas } from "@utils/number-util";
import { chunkArray, createEmptyArray } from "@utils/array-util";

import Section from "./Section";
import DeltaTag from "./DeltaTag";
import UpdatesRow, {
  UpdateRow,
  UpdateRowSkeleton,
} from "./updates/Updates_Row";
import Skeleton from "./Skeleton";
import Column from "./Column";
import Space from "./Space";

export interface LiveBoardComparedValue {
  label: string;
  delta: number;
}

interface Props {
  currentValue: number;
  currentValueLabel: string;
  comparedValues: Array<LiveBoardComparedValue>;
  updates: Array<UpdateRow>;
  updatesModalTrigger?: React.ReactNode;
}

const LiveBoard: React.FC<Props> = ({
  currentValueLabel,
  currentValue,
  comparedValues,
  updates,
  updatesModalTrigger,
}) => {
  const [activeUpdateId, setActiveUpdateId] = useState(0);

  useEffect(() => {
    let intervalId = setInterval(() => {
      setActiveUpdateId((prev) => (prev + 1) % updates.length);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const chunckedComparedValues = useMemo(
    () => chunkArray(comparedValues, 2),
    [comparedValues]
  );

  return (
    <Wrapper>
      <StatsContainer>
        <CurrentValueContainer>
          <CurrentValueLabel>{currentValueLabel}</CurrentValueLabel>
          <CurrentValue>
            {numberWithCommas(currentValue)}
            <span>명</span>
          </CurrentValue>
        </CurrentValueContainer>
        {chunckedComparedValues.map((column, index) => (
          <Column key={index}>
            {column.map(({ delta, label }) => (
              <ComparedValueContainer key={label}>
                <ComparedValueLabel>{label}</ComparedValueLabel>
                <DeltaTag delta={delta} small />
              </ComparedValueContainer>
            ))}
          </Column>
        ))}
      </StatsContainer>

      {updates?.length > 0 ? (
        React.cloneElement(updatesModalTrigger as JSX.Element, {
          children: (
            <UpdatesContainer>
              {updates.map(
                (update, index) =>
                  activeUpdateId === index && (
                    <UpdatesRow
                      key={update.date}
                      fadeInUp
                      type="preview"
                      {...update}
                    />
                  )
              )}
            </UpdatesContainer>
          ),
        })
      ) : (
        <>
          <UpdatesContainer>
            <MockUpdateRow>추가 확진자가 없어요</MockUpdateRow>
          </UpdatesContainer>
        </>
      )}
    </Wrapper>
  );
};

export const LiveBoardSkeleton: React.FC<{ columns: number }> = ({
  columns,
}) => {
  return (
    <Wrapper>
      <StatsContainer>
        <CurrentValueContainer>
          <CurrentValueLabel>
            <Skeleton w={42} h={17} />
          </CurrentValueLabel>
          <Space h={8} />
          <CurrentValue>
            <Skeleton w={75} h={35} />
          </CurrentValue>
        </CurrentValueContainer>
        {createEmptyArray(columns, 2).map((column, index) => (
          <Column key={index}>
            {column.map((_, index) => (
              <ComparedValueContainer key={index}>
                <Skeleton w={50} h={21} />
                <Space w={6} />
                <Skeleton w={60} h={21} />
              </ComparedValueContainer>
            ))}
          </Column>
        ))}
      </StatsContainer>
      <UpdateRowSkeleton type="preview" />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  column: true,
  overflow: "hidden",
});

const StatsContainer = styled(Section, {
  rowCenteredY: true,
  paddingY: rem(12),
  justifyContent: "space-evenly",

  defaultVariants: {
    sub: true,
  },
});

const CurrentValueContainer = styled("div", {
  columnCenteredX: true,
});
const CurrentValueLabel = styled("div", {
  caption1: true,

  color: "$gray900",
  opacity: 0.8,

  "@md": {
    body3: true,

    opacity: 0.9,
  },
});
const CurrentValue = styled("div", {
  heading1: true,
  color: "$gray900",

  "& span": {
    fontWeight: 400,
  },
});

const MockUpdateRow = styled("div", {
  body2: true,
  centered: true,

  height: rem(50),
  color: "$gray900",
});

const ComparedValueContainer = styled("div", {
  rowCenteredY: true,
  marginY: rem(5),
  justifyContent: "space-between",
});

const ComparedValueLabel = styled("div", {
  body3: true,

  color: "$gray900",
  marginRight: rem(2),
  minWidth: rem(50),
  maxWidth: rem(50),

  "&:before": {
    content: "vs",
    marginRight: rem(4),
    color: "$gray700",
  },
});

const UpdatesContainer = styled("div", {
  // rowCenteredY: true,
  // justifyContent: "space-between",
});

export default LiveBoard;
