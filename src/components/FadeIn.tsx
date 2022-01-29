import React from "react";

import { Presence } from "@radix-ui/react-presence";

import { styled } from "@styles/stitches.config";
import { fadeIn, fadeOut } from "@styles/animations/fade-animation";

import Child from "./Child";

interface Props {
  show: boolean;
  fallback: React.ReactNode;
  children: React.ReactNode;
}

const FadeIn: React.FC<Props> = ({ show, fallback, children }) => {
  return (
    <>
      <Presence present={show === true}>
        <FadeAnimation data-state={show === true ? "show" : "hide"}>
          {React.cloneElement(<Child>{children}</Child>)}
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
            {React.cloneElement(<Child>{fallback}</Child>, {})}
          </div>
        </FallbackFadeAnimation>
      </Presence>
    </>
  );
};

const FallbackFadeAnimation = styled("div", {
  zIndex: 2,

  '&[data-state="hide"]': {
    animation: `${fadeOut} 2000ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

const FadeAnimation = styled("div", {
  zIndex: 1,

  '&[data-state="show"]': {
    animation: `${fadeIn} 750ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
  '&[data-state="hide"]': {
    animation: `${fadeOut} 750ms cubic-bezier(0.16, 1, 0.3, 1)`,
  },
});

export default FadeIn;
