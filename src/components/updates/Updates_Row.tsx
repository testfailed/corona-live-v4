import React from "react";

import { styled } from "@styles/stitches.config";
import UpdatesTimeDisplay from "./Updates_TimeDisplay";
import { ChevronDownIcon } from "@components/icon/Icon_Chevron";
import { rem } from "polished";
import { fadeInUp } from "@styles/animations/fade-animation";
import Skeleton from "@components/Skeleton";
import Space from "@components/Space";

export interface UpdateRow {
  date: string;
  update: string;
  category?: string;
}

interface Props extends UpdateRow {
  type?: "preview";
  fadeInUp?: boolean;
}

const UpdatesRow: React.FC<Props> = ({ type, date, update, fadeInUp }) => {
  return (
    <Wrapper fadeInUp={fadeInUp} preview={type === "preview"}>
      <UpdatesTimeDisplay date={date} />
      <Value dangerouslySetInnerHTML={{ __html: update }} />
      {type === "preview" && <ChevronDownIcon />}
    </Wrapper>
  );
};

export const UpdateRowSkeleton: React.FC<{ type?: "preview" }> = ({ type }) => {
  return (
    <Wrapper
      preview={type === "preview"}
      css={{ height: type === "preview" ? "auto" : rem(50) }}
    >
      <Skeleton w={64} h={18} />
      <Skeleton w={150} h={18} />
      {type === "preview" && <Skeleton w={24} h={24} />}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: `${rem(90)} 1fr`,
  minHeight: rem(50),
  maxHeight: rem(50),
  borderTop: `${rem(1)} solid $gray100`,

  "&:first-of-type": {
    border: "none",
  },

  "& > *": {
    alignSelf: "center",
  },

  variants: {
    preview: {
      true: {
        rowCenteredY: true,
        paddingX: rem(16),
        flexShrink: 0,
        justifyContent: "space-between",
      },
    },
    fadeInUp: {
      true: {
        animation: `${fadeInUp} 350ms`,
      },
    },
  },
});

const Value = styled("div", {
  rowCenteredY: true,
  body3: true,

  "& > strong": {
    marginRight: rem(4),
  },
});

export default UpdatesRow;
