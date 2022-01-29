import React from "react";

import { rem } from "polished";

import { css } from "@styles/stitches.config";

import { Modal, ModalContent, ModalTrigger } from "@components/Modal";
import { fadeIn } from "@styles/animations/fade-animation";

const UpdatesModal: React.FC<{
  title?: string;
  triggerNode?: React.ReactNode;
}> = ({ children, title, triggerNode }) => {
  return (
    <Modal asChild={false} modalId="updates" transition={{ open: fadeIn }}>
      <ModalContent
        title={title ?? "실시간 확진 현황"}
        showCloseButton
        className={css({
          column: true,

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
        {children}
      </ModalContent>
      <ModalTrigger>{triggerNode}</ModalTrigger>
    </Modal>
  );
};

export default UpdatesModal;
