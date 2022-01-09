import * as React from "react";

import { rem } from "polished";

import { styled, theme, keyframes } from "@styles/stitches.config";

interface Props {
  size?: number;
  color?: string;
  background?: string;
}

const Spinner: React.FC<Props> = ({
  size = 20,
  color = theme.colors.gray900,
  background = theme.colors.gray100,
}) => {
  return (
    <Wrapper
      css={{
        "--indicator-size": rem(size),
        "--indicator-thickness": rem(size / 10),
        "--indicator-color": color,
        "--indicator-background": background,
      }}
    ></Wrapper>
  );
};

const keyFrame = keyframes({
  from: {
    transform: "rotate(0deg)",
  },
  to: {
    transform: "rotate(360deg)",
  },
});

const Wrapper = styled("div", {
  "--indicator-size-half": "calc(var(--indicator-size) / 2)",
  width: `var(--indicator-size)`,
  height: `var(--indicator-size)`,
  position: "relative",
  borderRadius: "50%",
  transform: "translatez(0)",
  boxShadow: `inset 0 0 0 calc(var(--indicator-size) / 10) var(--indicator-color)`,

  "&:before, &:after": {
    height: "var(--indicator-size)",
    width: "var(--indicator-size-half)",
    content: "",
    position: "absolute",
    background: "var(--indicator-background)",
    top: "0em",
  },

  "&:before": {
    animation: `${keyFrame} 1.5s infinite ease 0.5s`,
    left: 0,
    transformOrigin: "var(--indicator-size-half) var(--indicator-size-half)",
  },

  "&:after": {
    animation: `${keyFrame} 2s infinite ease 0.5s`,
    left: "var(--indicator-size-half)",
    transformOrigin: "0 var(--indicator-size-half)",
  },
});

export default Spinner;
