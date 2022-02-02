import React from "react";

import { rem } from "polished";
import { useLocation, useHistory } from "react-router-dom";

import { useTheme } from "@contexts/ThemeContext";
import { css, styled } from "@styles/stitches.config";

import Row from "@components/Row";
import Switch from "@components/Switch";
import Section from "@components/Section";
import { Tabs, Tab } from "@components/Tabs";
import ReportModalTrigger from "@components/modal/Modal_Report";

import NightIcon from "@components/icon/Icon_Night";
import WorldIcon from "@components/icon/Icon_World";
import VaccineIcon from "@components/icon/Icon_Vaccine";
import DomesticIcon from "@components/icon/Icon_Domestic";
import CoronaLiveIcon from "@components/icon/Icon_CoronaLive";
import SendMessageIcon from "@components/icon/Icon_SendMessage";

import {
  DOMESTIC_PATH,
  VACCINE_PATH,
  WORLD_PATH,
} from "@constants/route-constants";

const LayoutMenu: React.FC = () => {
  const { push } = useHistory();
  const { pathname } = useLocation();
  const { colorMode, toggleTheme } = useTheme();

  return (
    <Wrapper>
      <Section>
        <MenuHeader>
          <CoronaLiveIcon />
        </MenuHeader>
      </Section>

      <Section>
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
          orientation="vertical"
          tabIndicatorType="contained"
          delay
          // animation={false}
        >
          <Tab value={DOMESTIC_PATH} text="국내" icon={<DomesticIcon />} />
          <Tab value={WORLD_PATH} text="세계" icon={<WorldIcon />} />
          <Tab value={VACCINE_PATH} text="백신" icon={<VaccineIcon />} />
        </Tabs>
      </Section>

      <Section>
        <MenuThemeContainer>
          <Row centeredY>
            <NightIcon />
            <MenuText>다크모드</MenuText>
          </Row>
          <Switch onClick={toggleTheme} checked={colorMode == "dark"} />
        </MenuThemeContainer>

        <ReportModalTrigger>
          <MenuContainer>
            <SendMessageIcon />
            <MenuText>제보 / 문의</MenuText>
          </MenuContainer>
        </ReportModalTrigger>
      </Section>
    </Wrapper>
  );
};

const tabsCss = css({
  background: "$white",
});

const tabCss = css({
  rowCenteredY: true,
  padding: rem(16),
  borderLeft: `${rem(4)} solid transparent`,
});

const tabTextCss = css({
  body1: true,
  marginLeft: rem(10),
});

const activeTabTextCss = css({
  subtitle2: true,
});

const tabIndicatorCss = css({
  background: `rgba($gray900rgb, 0.03)`,
  "&:before": {
    content: "",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: rem(3),
    borderRadius: rem(2),
    height: "100%",
    background: `rgba($gray900rgb, 1)`,
  },
});

const Wrapper = styled("div", {
  column: true,
  width: rem(240),
  marginRight: rem(80),
  display: "none",

  "@lg": {
    position: "sticky",
    height: "100%",
    top: rem(40),
    display: "flex",
  },
});

const MenuHeader = styled("div", {
  rowCentered: true,
  padding: rem(16),
});

const MenuContainer = styled("div", {
  rowCenteredY: true,
  padding: rem(16),
  borderLeft: `${rem(4)} solid transparent`,
});

const MenuThemeContainer = styled(MenuContainer, {
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
});

const MenuText = styled("div", {
  marginLeft: rem(10),
  body1: true,
});

export default LayoutMenu;
