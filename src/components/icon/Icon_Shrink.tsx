import React from "react";

import Icon from "./Icon";

import type { IconProps } from "@_types/icon-type";

const ShrinkIcon: React.FC<IconProps> = React.memo((props) => (
  <Icon {...props} type="stroke">
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      viewBox="0 0 64 64"
      enable-background="new 0 0 64 64"
    >
      <line
        fill="none"
        stroke-width="6"
        stroke-miterlimit="10"
        x1="64"
        y1="5"
        x2="0"
        y2="5"
      />
      <line
        fill="none"
        stroke-width="6"
        stroke-miterlimit="10"
        x1="64"
        y1="59"
        x2="0"
        y2="59"
      />
      <polyline
        fill="none"
        stroke-width="6"
        stroke-linejoin="bevel"
        stroke-miterlimit="10"
        points="25,19 32,26 
	39,19 "
      />
      <line
        fill="none"
        stroke-width="6"
        stroke-miterlimit="10"
        x1="32"
        y1="26"
        x2="32"
        y2="5"
      />
      <polyline
        fill="none"
        stroke-width="6"
        stroke-linejoin="bevel"
        stroke-miterlimit="10"
        points="39,45 32,38 
	25,45 "
      />
      <line
        fill="none"
        stroke-width="6"
        stroke-miterlimit="10"
        x1="32"
        y1="38"
        x2="32"
        y2="59"
      />
    </svg>
  </Icon>
));

export default ShrinkIcon;
