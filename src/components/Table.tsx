import React, { useMemo, useState } from "react";

import { rem } from "polished";
import { CSS } from "@stitches/react";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

import { numberWithCommas } from "@utils/number-util";
import { styled, theme } from "@styles/stitches.config";

import Space from "./Space";
import DeltaTag from "./DeltaTag";
import { ArrowDownIcon, ArrowUpIcon } from "./icon/Icon_Arrow";

export interface TableColumn<T> {
  id: T;
  name: string;
  sortable?: boolean;
  defaultSortBy?: boolean;
  width?: string;
  deltaPosition?: "right" | "bottom";
}

export interface TableRowValue {
  image?: string;
  text?: string;
  stat?: number;
  delta?: number;
}
export type TableRow<T extends string> = Partial<
  Record<T | "link", TableRowValue>
>;

interface Props<T extends string> {
  columns: Array<TableColumn<T>>;
  rows: Array<TableRow<T>>;
  deltaPosition?: "right" | "bottom";
  statUnit?: string;
  css?: CSS;
}

type Order = "desc" | "asc";

const Table = <T extends string>(props: Props<T>) => {
  const { columns, rows, deltaPosition, statUnit, css } = props;

  const initalSortBy = columns.find(
    (a) => a.defaultSortBy === true && a.sortable === true
  )?.id as T;

  const [sortOrder, setSortOrder] = useState<Order>("desc");
  const [sortBy, setSortBy] = useState<T>(initalSortBy);

  const sortedRows = useMemo(
    () =>
      sortBy
        ? rows.sort((rowA, rowB) =>
            sortOrder === "asc"
              ? (rowA[sortBy].stat ?? 0) - (rowB[sortBy].stat ?? 0)
              : (rowB[sortBy].stat ?? 0) - (rowA[sortBy].stat ?? 0)
          )
        : rows,
    [rows, sortOrder, sortBy]
  );

  const { ref, inView } = useInView({
    threshold: 0,
    trackVisibility: true,
    delay: 100,
  });

  console.log(inView);

  return (
    <Wrapper>
      <InViewCheck ref={ref} />
      <Root css={css}>
        <THead>
          <Tr>
            {columns.map(({ id, name, width, sortable }, index) => {
              const onClick = () => {
                if (sortable) {
                  setSortOrder((prevOrder) =>
                    sortBy === id
                      ? prevOrder === "desc"
                        ? "asc"
                        : "desc"
                      : "desc"
                  );
                  setSortBy(id);
                }
              };

              return (
                <Th
                  key={index}
                  css={{
                    ...(width ? { minWidth: width } : {}),
                    ...(sortable ? { cursor: "pointer" } : {}),
                  }}
                  onClick={onClick}
                >
                  <ThContainer>
                    <ThName>{name}</ThName>
                    {sortBy === id && (
                      <>
                        {sortOrder === "desc" && (
                          <ArrowUpIcon stroke={theme.colors.gray700} />
                        )}
                        {sortOrder === "asc" && (
                          <ArrowDownIcon stroke={theme.colors.gray700} />
                        )}
                      </>
                    )}
                  </ThContainer>
                </Th>
              );
            })}
          </Tr>
        </THead>
        <TBody>
          {sortedRows.map((row, index) => (
            <Tr key={index}>
              {columns.map(({ id, width, deltaPosition }, index) => {
                return (
                  <Td
                    key={index}
                    css={{
                      ...(width ? { minWidth: width } : {}),
                    }}
                    shadow={inView === false}
                    centered={!row[id]?.image}
                  >
                    <Link to={row?.link?.text ?? ""}>
                      <TdContainer
                        ref={ref}
                        css={{
                          ...(index !== 0 && deltaPosition === "bottom"
                            ? {
                                justifyContent: "flex-end",
                              }
                            : {}),
                        }}
                      >
                        {!!row[id]?.image && (
                          <img src={row[id]?.image} alt={""}></img>
                        )}

                        {!!row[id]?.text && <Text>{row[id].text}</Text>}
                        <StatContainer column={deltaPosition === "bottom"}>
                          {row[id]?.stat !== undefined && (
                            <>
                              <Stat>{numberWithCommas(row[id].stat)}</Stat>
                              {statUnit && <StatUnit>{statUnit}</StatUnit>}
                            </>
                          )}
                          {!!row[id]?.delta && (
                            <>
                              <Space w={6} />
                              <DeltaTag delta={Number(row[id].delta)} small />
                            </>
                          )}
                        </StatContainer>
                      </TdContainer>
                    </Link>
                  </Td>
                );
              })}
            </Tr>
          ))}
        </TBody>
      </Root>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  overflowX: "auto",
  position: "relative",
  paddingBottom: rem(16),

  paddingX: rem(12),

  "@md": {
    paddingX: rem(20),
  },
});

const Root = styled("table", {
  overflowY: "hidden",
  borderSpacing: `${rem(6)} ${rem(2)}`,
});

const TBody = styled("tbody", {});

const THead = styled("thead", {});

const Th = styled("th", {
  paddingBottom: rem(12),
  paddingLeft: rem(2),

  "&first-of-child": {
    textAlign: "center",
  },
});

const ThContainer = styled("div", {
  rowCenteredY: true,
});

const ThName = styled("div", {
  caption1: true,
  color: "$gray700",
  textAlign: "left",

  "& + svg": {
    marginLeft: rem(4),
  },
});

const Text = styled("div", {});
const Stat = styled("div", {
  flexShrink: 0,

  [`& + ${DeltaTag}`]: {
    marginLeft: rem(6),
  },
});

const StatUnit = styled("div", {
  caption2: true,

  opacity: 0.6,
  marginLeft: rem(2),
});

const StatContainer = styled("div", {
  rowCenteredY: true,
  variants: {
    column: {
      true: {
        column: true,
        alignItems: "flex-end",
        [`${Stat}`]: {
          marginBottom: rem(2),
        },
      },
    },
  },
});

const TdContainer = styled("div", {
  rowCenteredY: true,
  minHeight: rem(48),
  maxHeight: rem(48),
  paddingX: rem(8),
  borderRadius: rem(8),
  flexShrink: 0,

  "& img": {
    width: rem(20),
    borderRadius: rem(2),
    marginRight: rem(6),
  },
});

const Td = styled("td", {
  padding: rem(0),
  borderRadius: rem(8),
  position: "relative",
  verticalAlign: "middle",

  "& a": {
    color: "$gray900",
    textDecoration: "none",
  },

  "&:first-of-type": {
    position: "sticky",
    left: 0,
    zIndex: 5,

    [`&:before`]: {
      content: "",
      position: "absolute",
      borderRadius: rem(8),
      background: "$white",
      width: "calc(200%)",
      height: "100%",
      right: 0,
      top: 0,
      bottom: 0,
      zIndex: -1,
    },

    [`&:after`]: {
      content: "",
      position: "absolute",
      background: "inherit",
      boxShadow: `${rem(4)} 0 ${rem(14)} ${rem(4)} #00000005`,
      transition: "150ms",
      width: rem(0.1),
      height: "100%",
      right: 2,
      top: 0,
      bottom: 0,
      zIndex: -1,
    },
  },

  variants: {
    shadow: {
      true: {
        "&:first-of-type": {
          [`&:after`]: {
            boxShadow: `${rem(4)} 0 ${rem(14)} ${rem(4)} #0000000005`,
          },
        },
      },
    },
    centered: {
      true: {
        "&:first-of-type": {
          [`& ${TdContainer}`]: {
            justifyContent: "center",
          },
        },
      },
    },
  },
});

const Tr = styled("tr", {
  subtitle3: true,

  color: "$gray900",
  [`&:nth-child(odd) ${TdContainer}`]: {
    background: "$gray100",
  },
  position: "relative",
});

const InViewCheck = styled("div", {
  width: rem(1),
  height: "100%",
  position: "absolute",
  top: 0,
  background: "transparent",
});

export default Table;
