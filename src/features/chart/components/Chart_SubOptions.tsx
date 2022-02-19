import React from "react";

import { rem } from "polished";

import { css } from "@styles/stitches.config";

import Row from "@components/Row";
import { Tab, TabProps, Tabs } from "@components/Tabs";

interface Props<T extends string> {
  values: Record<T, string>;
  onChange: (optionName: string, value: T) => void;
  subOptions: Record<T, Array<TabProps>>;
}

const ChartSubOptions = <T extends string>(props: Props<T>) => {
  const { values, onChange, subOptions } = props;
  return (
    <Row css={{ width: "100%", justifyContent: "space-between" }}>
      {(Object.keys(subOptions) as T[]).map((subOptionName) => {
        const subOption = subOptions[subOptionName];
        return (
          <Tabs
            {...{
              css: tabsCss,
              tabCss,
              tabTextCss,
              tabIndicatorCss,
              activeTabTextCss,
            }}
            key={subOptionName}
            value={values[subOptionName]}
            onChange={(value) => onChange(subOptionName, value as T)}
            tabIndicatorType="contained"
            tabIndicatorTransform="scale(0.9,0.8)"
          >
            {subOption.map((tab) => (
              <Tab key={tab.value} {...tab} />
            ))}
          </Tabs>
        );
      })}
    </Row>
  );
};

const tabsCss = css({
  background: "$gray100",
  borderRadius: rem(8),
});

const tabCss = css({
  height: rem(36),
  rowCentered: true,
  padding: 0,
  paddingX: rem(10),
  borderRadius: rem(8),

  "@md": {
    paddingX: rem(14),
  },
});

const tabTextCss = css({
  body3: true,
  whiteSpace: "nowrap",

  color: "$gray900",
  textAlign: "centre",
  opacity: 0.8,

  transition: "opacity 300ms",

  "@md": {
    body1: true,
  },
});

const activeTabTextCss = css({
  body3: true,
  fontWeight: 700,
  opacity: 1,
  color: "$gray900",
  whiteSpace: "nowrap",

  "@md": {
    subtitle2: true,
  },
});

const tabIndicatorCss = css({
  boxShadow: "$subSectionBoxShadow",
  background: "$shadowBackground2",

  borderRadius: rem(8),
  border: `${rem(1)} solid $chartOptionBorder`,
});

export default ChartSubOptions;
