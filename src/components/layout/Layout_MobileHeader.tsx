import React, { useEffect, useState } from "react";

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
import { Tabs, Tab } from "@components/Tabs";
import { useTheme } from "@contexts/ThemeContext";
import MenuIcon from "@components/icon/Icon_Menu";
import ThemeIcon from "@components/icon/Icon_Theme";
import Section, { SubSection } from "@components/Section";
import CoronaLiveIcon from "@components/icon/Icon_CoronaLive";
import SendMessageIcon from "@components/icon/Icon_SendMessage";
import ReportModalTrigger from "@components/modal/Modal_Report";
import { useTranslation } from "react-i18next";

const LayoutMobileHeader: React.FC = () => {
  const [renderThemeButton, setRenderThemeButton] = useState<boolean>(null);

  const location = useLocation();
  const { push } = useHistory();
  const { toggleTheme } = useTheme();
  const { i18n } = useTranslation();

  useEffect(() => {
    setRenderThemeButton(Math.random() >= 0.5);
  }, []);

  const { t } = useTranslation();
  const { pathname } = location;

  return (
    <Wrapper>
      <Header>
        {renderThemeButton === true && (
          <Button icon onClick={toggleTheme} css={{ fadeIn: true }}>
            <ThemeIcon size={18} />
          </Button>
        )}
        {renderThemeButton === false && (
          <ReportModalTrigger>
            <Button icon css={{ fadeIn: true }}>
              <SendMessageIcon size={18} />
            </Button>
          </ReportModalTrigger>
        )}

        <CoronaLiveIcon />

        <LayoutMobileMenuTrigger>
          <Button icon>
            <MenuIcon size={20} />
          </Button>
        </LayoutMobileMenuTrigger>
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
      >
        <Tab text={t("menu.domestic")} value={DOMESTIC_PATH} />
        <Tab text={t("menu.world")} value={WORLD_PATH} />
        <Tab text={t("menu.vaccine")} value={VACCINE_PATH} />
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

const Header = styled(SubSection, {
  rowCenteredY: true,
  justifyContent: "space-between",
  paddingTop: rem(10),
  paddingBottom: rem(6),
  paddingX: rem(16),

  boxShadow: "none!important",

  "@md": {
    boxShadow: `${theme.shadows.subSectionBoxShadow}!important`,
  },
});

export default LayoutMobileHeader;
