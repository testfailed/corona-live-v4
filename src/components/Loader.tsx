import React from "react";

import { rem } from "polished";

import { styled, keyframes } from "@styles/stitches.config";

const Loader: React.FC = () => {
  return (
    <Wrapper>
      <div />
      <div />
      <div />
      <div />
    </Wrapper>
  );
};

const Animation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

const Wrapper = styled("div", {
  display: "inline-block",
  position: "relative",
  width: rem(48),
  height: rem(48),

  "& > div": {
    boxSizing: "border-box",
    display: "block",
    position: "absolute",
    width: rem(36),
    height: rem(36),
    border: `${rem(2)} solid #888`,
    borderRadius: "50%",
    borderColor: `#aaa transparent transparent transparent`,
    animation: `${Animation} 1100ms cubic-bezier(0.5, 0, 0.5, 1) infinite`,

    "&:nth-child(1)": {
      animationDelay: "-400ms",
    },
    "&:nth-child(2)": {
      animationDelay: "-250ms",
    },
    "&:nth-child(3)": {
      animationDelay: "-100ms",
    },
  },
});

export default Loader;
