import React from "react";

import Icon from "./Icon";

import { styled } from "@styles/stitches.config";

import type { IconProps } from "@_types/icon-type";

const ExpandIcon: React.FC<IconProps & { expanded?: boolean }> = React.memo(
  ({ expanded = true, ...props }) => (
    <Icon {...props} type="stroke" size={16}>
      <Svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        viewBox="0 0 64 64"
        enableBackground="new 0 0 64 64"
      >
        <line
          fill="none"
          strokeWidth="4"
          strokeMiterlimit="10"
          x1="64"
          y1="21"
          x2="0"
          y2="21"
          style={{
            transform: `translate3d(0,${expanded ? -18 : 2}px,0)`,
          }}
        />
        <line
          fill="none"
          strokeWidth="4"
          strokeMiterlimit="10"
          x1="0"
          y1="43"
          x2="64"
          y2="43"
          style={{
            transform: `translate3d(0,${expanded ? 18 : -2}px,0)`,
          }}
        />
        <polyline
          fill="none"
          strokeWidth="4"
          strokeLinejoin="bevel"
          strokeMiterlimit="10"
          points="39,8 32,1 25,8 
	"
          style={{
            transform: `translate3d(0,${expanded ? 38 : 2}px,0)`,
          }}
        />
        <line
          fill="none"
          strokeWidth="4"
          strokeMiterlimit="10"
          x1="32"
          y1="1"
          x2="32"
          y2="21"
        />
        <polyline
          fill="none"
          strokeWidth="4"
          strokeLinejoin="bevel"
          strokeMiterlimit="10"
          points="25,56 32,63 
	39,56 "
          style={{
            transform: `translate3d(0px, ${expanded ? -38 : -2}px, 0)`,
          }}
        />
        <line
          fill="none"
          strokeWidth="4"
          strokeMiterlimit="10"
          x1="32"
          y1="63"
          x2="32"
          y2="43"
        />
      </Svg>
    </Icon>
  )
);

const Svg = styled("svg", {
  transform: "translateY(1px)",
  ["& > line, & > polyline"]: {
    transition: "transform 300ms",
  },
});

export default ExpandIcon;
