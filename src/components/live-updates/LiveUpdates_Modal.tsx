import React from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import { css } from "@styles/stitches.config";

import { Modal, ModalContent, ModalTrigger } from "@components/Modal";
import { fadeIn } from "@styles/animations/fade-animation";
import { styled } from "@stitches/react";

const LiveUpdatesModal: React.FC<{
  title?: string;
  triggerNode?: React.ReactNode;
}> = ({ children, title, triggerNode }) => {
  const { t } = useTranslation();

  return (
    <Modal asChild={false} modalId="updates">
      <ModalContent
        transition={{ open: fadeIn }}
        title={title ?? t("updates.title")}
        showCloseButton
        className={css({
          column: true,
          flex: 1,

          width: "100%",
          height: "100%",
          padding: rem(16),
          borderRadius: `${rem(0)}!important`,

          "@md": {
            width: rem(360),
            height: "80%",
            borderRadius: `${rem(8)}!important`,
          },
        })}
      >
        <Wrapper>{children}</Wrapper>
      </ModalContent>
      <ModalTrigger>{triggerNode}</ModalTrigger>
    </Modal>
  );
};

const Wrapper = styled("div", {
  column: true,
  position: "relative",
  overflowY: "hidden",
  flex: 1,

  "& > div": {
    height: "100%",
  },
});

export default LiveUpdatesModal;
