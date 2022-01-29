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

interface Props {}

const LayoutMobileMenuModalTrigger: React.FC<Props> = ({ children }) => {
  const { colorMode, toggleTheme } = useTheme();

  return (
    <Modal
      modalId="menu"
      triggerNode={children}
      title="메뉴"
      showCloseButton
      transition={{ open: fadeIn }}
      className={css({
        width: "100%",
        height: "100%",
        padding: rem(16),
        borderRadius: `${rem(0)}!important`,

        "@md": {
          height: "100%",
          maxWidth: rem(360),
          maxHeight: "85vh",
          borderRadius: `${rem(8)}!important`,
        },
      })}
      asChild
    >
      <Wrapper>
        <MenuThemeContainer>
          <Row centeredY>
            <NightIcon />
            <MenuText>다크모드</MenuText>
          </Row>
          <Switch small onClick={toggleTheme} checked={colorMode === "dark"} />
        </MenuThemeContainer>

        <ReportModalTrigger>
          <MenuContainer>
            <SendMessageIcon />
            <MenuText>제보 / 피드백</MenuText>
          </MenuContainer>
        </ReportModalTrigger>
      </Wrapper>
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
  borderTop: `${rem(1)} solid rgba($gray900rgb,0.1)`,
  cursor: "pointer",

  "&:first-of-type": {},
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
