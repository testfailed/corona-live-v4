import React from "react";

import { styled, theme } from "@styles/stitches.config";

interface Props {
  color?: string;
  width?: number;
  height?: number;
}

const Gradient: React.FC<Props> = ({
  color = theme.colors.white.computedValue,
  width = 26,
  height = 30,
}) => {
  return (
    <Wrapper>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="grad1" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop
              offset="0%"
              style={{
                stopColor: color,
                stopOpacity: 1,
              }}
            />
            <stop
              offset="15%"
              style={{
                stopColor: color,
                stopOpacity: 1,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: color,
                stopOpacity: 0,
              }}
            />
          </linearGradient>
        </defs>
        <rect width={width} height={height} fill="url(#grad1)" />
      </svg>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  centered: true,
});

export default Gradient;
