import React from "react";

import Icon from "./Icon";

import type { IconProps } from "@_types/icon-type";

const ChevronIcon: React.FC<IconProps> = React.memo((props) => (
  <Icon type="stroke" {...props} size={props.size ?? 24}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1"
      className="feather feather-chevron-left"
      viewBox="0 0 24 24"
    >
      <path d="M15 18L9 12 15 6"></path>
    </svg>
  </Icon>
));

export const ChevronLeftIcon: React.FC<IconProps> = React.memo((props) => (
  <ChevronIcon style={{ transform: "rotate(0deg)" }} {...props} />
));

export const ChevronTopIcon: React.FC<IconProps> = React.memo((props) => (
  <ChevronIcon style={{ transform: "rotate(90deg)" }} {...props} />
));

export const ChevronRightIcon: React.FC<IconProps> = React.memo((props) => (
  <ChevronIcon style={{ transform: "rotate(180deg)" }} {...props} />
));

export const ChevronDownIcon: React.FC<IconProps> = React.memo((props) => (
  <ChevronIcon style={{ transform: "rotate(270deg)" }} {...props} />
));
