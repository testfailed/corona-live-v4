import React from "react";

import { styled, theme } from "@styles/stitches.config";

interface Props {
  color: string;
}

const Gradient: React.FC<Props> = ({
  color = theme.colors.white.computedValue,
}) => {
  return (
    <Wrapper>
      <svg width="30" height="30">
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
              offset="35%"
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
        <rect width="30" height="30" fill="url(#grad1)" />
      </svg>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  centered: true,
});

export default Gradient;
