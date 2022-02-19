import React from "react";

import { Presence } from "@radix-ui/react-presence";

import { styled } from "@styles/stitches.config";
import { fadeIn, fadeOut } from "@styles/animations/fade-animation";

interface Props {
  show: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
  id?: string;
}

const FadeIn: React.FC<Props> = React.memo(
  ({ show, fallback, children }) => {
    return (
      <>
        <Presence present={show === true}>
          <FadeAnimation data-state={show === true ? "show" : "hide"}>
            {children}
          </FadeAnimation>
        </Presence>
        <Presence present={show === false}>
          <FallbackFadeAnimation
            css={{
              width: "100%",
              position: show === true ? "absolute" : "relative",
            }}
            data-state={show === false ? "show" : "hide"}
          >
            <div
              style={{
                width: "100%",
                zIndex: 1000,
                position: show === true ? "absolute" : "inherit",
              }}
            >
              {fallback}
            </div>
          </FallbackFadeAnimation>
        </Presence>
      </>
    );
  },
  (prev, next) => {
    return prev.show === next.show && prev.id === next.id;
  }
);

const FallbackFadeAnimation = styled("div", {
  zIndex: 2,

  '&[data-state="hide"]': {
    animation: `${fadeOut} 600ms cubic-bezier(0.45, 0.8, 0.65, 1)`,
  },
});

const FadeAnimation = styled("div", {
  zIndex: 1,

  '&[data-state="show"]': {
    animation: `${fadeIn} 400ms cubic-bezier(0.45, 0.8, 0.65, 1)`,
  },
  '&[data-state="hide"]': {
    animation: `${fadeOut} 400ms cubic-bezier(0.45, 0.8, 0.65, 1)`,
  },
});

export default FadeIn;
