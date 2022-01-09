import React from "react";

import { rem } from "polished";

import { parseResponsiveCss } from "@utils/css-util";
import { config, styled } from "@styles/stitches.config";

type ScreenType = keyof typeof config.media;

interface Props {
  w?: number | Partial<Record<ScreenType, number>>;
  h?: number | Partial<Record<ScreenType, number>>;
}

const Space: React.FC<Props> = ({ ...css }) => {
  return <Base css={parseResponsiveCss(css)} />;
};

const Base = styled("div", {
  minWidth: rem(1),
  minHeight: rem(1),
});

export default Space;
