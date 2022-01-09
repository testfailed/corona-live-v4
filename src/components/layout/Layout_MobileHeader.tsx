import React from "react";

import { rem } from "polished";
import { useHistory, useLocation } from "react-router-dom";

import {
  DOMESTIC_PATH,
  VACCINE_PATH,
  WORLD_PATH,
} from "@constants/route-constants";
import { css, styled, theme } from "@styles/stitches.config";

import LayoutMobileMenuTrigger from "./Layout_MobileMenuModal";

import Button from "@components/Button";
import Section from "@components/Section";
import { Tabs, Tab } from "@components/Tabs";
import Underline from "@components/Underline";
import MenuIcon from "@components/icon/Icon_Menu";
import CoronaLiveIcon from "@components/icon/Icon_CoronaLive";
import SendMessageIcon from "@components/icon/Icon_SendMessage";
import { ChevronLeftIcon } from "@components/icon/Icon_Chevron";
import ReportModalTrigger from "@components/modal/Modal_Report";

const LayoutMobileHeader: React.FC = (props) => {
  const title = null;
  const { goBack, push } = useHistory();
  const location = useLocation();
  const { pathname } = location;

  return (
    <Wrapper>
      <Header>
        {title ? (
          <>
            <Button icon onClick={goBack}>
              <ChevronLeftIcon size={18} />
            </Button>

            <Underline>{title}</Underline>

            <ReportModalTrigger>
              <Button icon>
                <SendMessageIcon size={18} />
              </Button>
            </ReportModalTrigger>
          </>
        ) : (
          <>
            <ReportModalTrigger>
              <Button icon>
                <SendMessageIcon size={18} />
              </Button>
            </ReportModalTrigger>

            <CoronaLiveIcon />

            <LayoutMobileMenuTrigger>
              <Button icon>
                <MenuIcon size={18} />
              </Button>
            </LayoutMobileMenuTrigger>
          </>
        )}
      </Header>
      <Tabs
        {...{
          css: tabsCss,
          tabCss,
          tabTextCss,
          tabIndicatorCss,
          activeTabTextCss,
        }}
        value={pathname}
        onChange={push}
        tabIndicatorLengthType="text"
        delay
        // animation={false}
      >
        <Tab text="국내" value={DOMESTIC_PATH} />
        <Tab text="백신" value={VACCINE_PATH} />
        <Tab text="세계" value={WORLD_PATH} />
      </Tabs>
    </Wrapper>
  );
};

const tabsCss = css({
  "@md": {
    paddingTop: rem(10),
  },
});

const tabCss = css({
  flex: 1,
  display: "flex",
  textAlign: "center",
  justifyContent: "center",
  paddingBottom: rem(10),
});

const tabTextCss = css({
  subtitle2: true,
  display: "flex",
  opacity: 0.5,
  color: "$gray900",

  "@md": {
    heading3: true,
  },
});

const activeTabTextCss = css({
  subtitle2: true,
  display: "flex",
  opacity: 1,

  "@md": {
    heading3: true,
  },
});

const tabIndicatorCss = css({
  height: `${rem(3)}!important`,
  borderRadius: rem(2),
  background: "$gray900",
});

const Wrapper = styled(Section, {
  column: true,

  "@lg": {
    display: "none",
  },
});

const Header = styled(Section, {
  rowCenteredY: true,
  justifyContent: "space-between",
  paddingY: rem(6),
  paddingX: rem(12),

  boxShadow: "none!important",

  "@md": {
    boxShadow: `${theme.shadows.subSectionBoxShadow}!important`,
  },

  defaultVariants: {
    sub: true,
  },
});

export default LayoutMobileHeader;
