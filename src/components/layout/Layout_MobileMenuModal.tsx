import React from "react";

import { rem } from "polished";

import { useTheme } from "@contexts/ThemeContext";
import { css, styled } from "@styles/stitches.config";
import { fadeIn } from "@styles/animations/fade-animation";

import Row from "@components/Row";
import Switch from "@components/Switch";
import { Modal } from "@components/Modal";
import NightIcon from "@components/icon/Icon_Night";
import SendMessageIcon from "@components/icon/Icon_SendMessage";
import ReportModalTrigger from "@components/modal/Modal_Report";
import LayoutFooter from "./Layout_Footer";
import Section, { SubSection } from "@components/Section";

interface Props {}

const LayoutMobileMenuModalTrigger: React.FC<Props> = ({ children }) => {
  const { colorMode, toggleTheme } = useTheme();

  return (
    <Modal
      modalId="menu"
      triggerNode={children}
      title="메뉴"
      showCloseButton
      className={css({
        width: "85%",
        padding: rem(16),
        background: "$background!important",

        "@md": {
          maxWidth: rem(360),
        },
      })}
      asChild
    >
      <Wrapper>
        <Section border>
          <MenuThemeContainer>
            <Row centeredY>
              <NightIcon />
              <MenuText>다크모드</MenuText>
            </Row>
            <Switch onClick={toggleTheme} checked={colorMode === "dark"} />
          </MenuThemeContainer>

          <ReportModalTrigger>
            <MenuContainer>
              <SendMessageIcon />
              <MenuText>제보 / 피드백</MenuText>
            </MenuContainer>
          </ReportModalTrigger>
        </Section>
      </Wrapper>
      <LayoutFooter simplified />
    </Modal>
  );
};

const Wrapper = styled("div", {
  column: true,

  "& button": {
    color: "$gray900",
  },
});

const MenuContainer = styled("div", {
  rowCenteredY: true,
  paddingY: rem(20),
  paddingX: rem(16),
  cursor: "pointer",

  borderTop: `${rem(1)} solid rgba($gray900rgb,0.1)`,

  "&:first-of-type": {
    borderTop: "none",
  },
});

const MenuThemeContainer = styled(MenuContainer, {
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  cursor: "default",
});

const MenuText = styled("div", {
  body2: true,
  marginLeft: rem(12),
});

export default LayoutMobileMenuModalTrigger;
