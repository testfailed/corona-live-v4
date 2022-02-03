import React, { useEffect, useRef } from "react";

import {
  Dialog,
  Trigger,
  DialogContent,
  DialogOverlay,
  Portal,
  Close,
  DialogProps,
} from "@radix-ui/react-dialog";
import { rem } from "polished";

import {
  fadeIn,
  fadeInUpCentered,
  fadeOut,
} from "@styles/animations/fade-animation";
import { Keyframe, styled } from "@styles/stitches.config";
import { CssComponent } from "@stitches/react/types/styled-component";

import Button from "./Button";
import Child from "./Child";
import CloseIcon from "./icon/Icon_Close";

interface ModalProps extends ModalContentProps {
  open?: DialogProps["open"];
  onOpenChange?: DialogProps["onOpenChange"];
  asChild?: boolean;
  triggerNode?: React.ReactNode;
  modalId?: string;
  transition?: { open?: Keyframe; closed?: Keyframe };
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  children,
  modalId,
  asChild = true,
  triggerNode,
  transition,
  ...props
}) => {
  const closeRef = useRef<any>(null);

  const onClose = () => {
    closeRef.current.click();
  };

  useEffect(() => {
    if (!onOpenChange) {
      const handleHashChange = () => {
        if (!window.location.hash.includes(modalId)) {
          onClose();
        }
      };

      window.addEventListener("hashchange", handleHashChange, false);
      return () => {
        window.removeEventListener("hashchange", handleHashChange, false);
      };
    }
  }, []);

  const handleOpenChange = (value) => {
    if (!onOpenChange) {
      if (value === false && modalId !== undefined) {
        window.location.hash = window.location.hash.replace(`/${modalId}`, "");
        if (window.location.hash === "") {
          window.history.replaceState(
            null,
            null,
            window.location.href.replace("#", "")
          );
        }
      }
    }
    onOpenChange?.(value);
  };

  const childrenProps = { ...props, modalId, onClose, transition };

  return (
    <Root {...(open && { open })} onOpenChange={handleOpenChange}>
      {triggerNode && (
        <ModalTrigger {...childrenProps}>{triggerNode}</ModalTrigger>
      )}
      {asChild ? (
        <ModalContent {...childrenProps}>{children}</ModalContent>
      ) : (
        React.Children.map(children, (child) => (
          <Child {...props}>{child}</Child>
        ))
      )}

      <Hidden>
        <Close ref={closeRef} />
      </Hidden>
    </Root>
  );
};

interface ModalContentProps {
  className?: CssComponent;
  showCloseButton?: boolean;
  onConfrim?: (closeModal: () => void) => void;
  confirmText?: React.ReactNode;
  modalId?: string;
  onClose?: () => void;
  title?: string;
  transition?: { open?: Keyframe; closed?: Keyframe };
}

export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
  title,
  showCloseButton,
  confirmText,
  onConfrim,
  onClose,
  transition,
}) => {
  const onConfirmButtonClick = () => {
    onConfrim?.(onClose);
  };

  return (
    <>
      <Portal>
        <Overlay />
        <Content
          className={className?.toString()}
          style={
            {
              "--open-animation": transition?.open ?? fadeInUpCentered,
              "--closed-animation": transition?.closed ?? fadeOut,
            } as React.CSSProperties
          }
        >
          {title && (
            <Heading>
              <EmptySpace />
              {title && <Title>{title}</Title>}
              {showCloseButton ? (
                <Close asChild>
                  <Button icon>
                    <CloseIcon />
                  </Button>
                </Close>
              ) : (
                <EmptySpace />
              )}
            </Heading>
          )}
          {children}
          {confirmText && onConfrim && (
            <Button onClick={onConfirmButtonClick}>{confirmText}</Button>
          )}
        </Content>
      </Portal>
    </>
  );
};

interface ModalTriggerProps {
  modalId?: string;
}

export const ModalTrigger: React.FC<ModalTriggerProps> = ({
  children,
  modalId,
}) => {
  const handleModalOpen = () => {
    if (!window.location.hash.includes(modalId) && modalId !== undefined) {
      window.location.hash += `/${modalId}`;
    }
  };

  return (
    <Trigger asChild style={{ cursor: "pointer" }} onClick={handleModalOpen}>
      {children}
    </Trigger>
  );
};

const Root = styled(Dialog, {
  background: "$white",
});

const Overlay = styled(DialogOverlay, {
  position: "fixed",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.68)",
  zIndex: 10000,
  cursor: "pointer",

  '&[data-state="open"]': {
    animation: `${fadeIn} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${fadeOut} 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const Content = styled(DialogContent, {
  backgroundColor: "$white",
  borderRadius: rem(8),
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate3d(-50%, -50%, 0rem)",
  zIndex: 10000,

  '&[data-state="open"]': {
    willChange: "transform, opacity",
    animation: `var(--open-animation) 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="closed"]': {
    willChange: "transform, opacity",
    animation: `var(--closed-animation) 400ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },

  "&:focus, & *:focus": {
    outline: "none",
    boxShadow: "none!important",
  },
});

const Heading = styled("div", {
  rowCenteredY: true,
  justifyContent: "space-between",
  marginBottom: rem(12),
});

const Title = styled("div", {
  subtitle2: true,
});

const EmptySpace = styled("div", {
  minWidth: rem(40),
});

const Hidden = styled("div", {
  visibility: "hidden",
  position: "fixed",
  left: -9999,
  top: -9999,
});
