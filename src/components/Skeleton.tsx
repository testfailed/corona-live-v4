import React from "react";

import { rem } from "polished";
import { CSS } from "@stitches/react";

import { parseResponsiveCss } from "@utils/css-util";
import { config, styled, keyframes } from "@styles/stitches.config";

type ScreenType = keyof typeof config.media;

interface Props extends CSS {
  w?: number | string | Partial<Record<ScreenType, number | string>>;
  h?: number | string | Partial<Record<ScreenType, number | string>>;
}

const Skeleton: React.FC<Props> = ({ ...css }) => {
  return <Base css={parseResponsiveCss(css)} />;
};

const Animation = keyframes({
  "0%": {
    transform: "translatex(-50%)",
  },
  "100%": {
    transform: "translatex(100%)",
  },
});

const Base = styled("div", {
  width: 32,
  height: 16,
  overflow: "hidden",
  position: "relative",
  borderRadius: rem(8),
  backgroundColor: "rgba(170, 170, 170, 0.1)",

  "&:after": {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    content: '""',
    position: "absolute",
    animation: `${Animation} 1s linear infinite`,
    transform: "translateX(100%)",
    background:
      "linear-gradient(90deg, transparent, rgba(170, 170, 170, 0.06), transparent)",
  },
});

export default Skeleton;
