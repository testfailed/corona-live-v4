import React from "react";

import Icon from "./Icon";

import type { IconProps } from "@_types/icon-type";

const ExpandIcon: React.FC<IconProps> = React.memo((props) => (
  <Icon {...props} type="stroke">
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      viewBox="0 0 64 64"
      enable-Background="new 0 0 64 64"
    >
      <line
        fill="none"
        strokeWidth="6"
        strokeMiterlimit="10"
        x1="64"
        y1="21"
        x2="0"
        y2="21"
      />
      <line
        fill="none"
        strokeWidth="6"
        strokeMiterlimit="10"
        x1="0"
        y1="43"
        x2="64"
        y2="43"
      />
      <polyline
        fill="none"
        strokeWidth="6"
        strokeLinejoin="bevel"
        strokeMiterlimit="10"
        points="39,8 32,1 25,8 
	"
      />
      <line
        fill="none"
        strokeWidth="6"
        strokeMiterlimit="10"
        x1="32"
        y1="1"
        x2="32"
        y2="21"
      />
      <polyline
        fill="none"
        strokeWidth="6"
        strokeLinejoin="bevel"
        strokeMiterlimit="10"
        points="25,56 32,63 
	39,56 "
      />
      <line
        fill="none"
        strokeWidth="6"
        strokeMiterlimit="10"
        x1="32"
        y1="63"
        x2="32"
        y2="43"
      />
    </svg>
  </Icon>
));

export default ExpandIcon;
