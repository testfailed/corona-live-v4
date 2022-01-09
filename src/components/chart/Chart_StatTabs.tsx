import React from "react";

import { rem } from "polished";

import { css } from "@styles/stitches.config";
import { Tab, TabProps, Tabs } from "@components/Tabs";

interface Props<T> {
  value: T;
  onChange: React.Dispatch<React.SetStateAction<T>>;
  statList: Array<TabProps>;
}

const ChartStatTabs = <T extends string>(props: Props<T>) => {
  const { value, onChange, statList } = props;
  return (
    <Tabs
      {...{
        css: tabsCss,
        tabCss,
        tabTextCss,
        activeTabTextCss,
        tabIndicatorCss,
      }}
      scrollable
      value={value}
      onChange={onChange}
      tabIndicatorType="underline"
      tabIndicatorLengthType="text"
    >
      {statList.map(({ text, value }) => (
        <Tab key={value} value={value} text={text} />
      ))}
    </Tabs>
  );
};

const tabsCss = css({
  paddingTop: rem(12),
  paddingBottom: rem(10),

  "@md": {
    width: "auto",
    justifyContent: "flex-start",
  },
});

const tabCss = css({
  paddingX: rem(12),
  "&:first-of-type": {
    paddingLeft: rem(20),
  },
  "&:last-of-type": {
    paddingRight: rem(20),
  },
});

const tabTextCss = css({
  subtitle2: true,
  color: "$gray900",
  opacity: 0.5,
  transition: "300ms",

  "@md": {
    subtitle1: true,
  },
});

const activeTabTextCss = css({
  subtitle2: true,
  color: "$gray900",
  "@md": {
    subtitle1: true,
  },
});

const tabIndicatorCss = css({
  height: `${rem(3)}!important`,
  background: "$gray900",
  borderRadius: rem(2),
  "@md": {
    height: `${rem(3)}!important`,
  },
});

export default ChartStatTabs;
