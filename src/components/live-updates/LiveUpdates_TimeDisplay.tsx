import React, { FC, useMemo } from "react";

import { rem } from "polished";

import { fromNow } from "@utils/date-util";
import { styled } from "@styles/stitches.config";

import NotificationIcon from "@components/icon/Icon_Notification";

interface Props {
  date: string;
}
const UpdatesTimeDisplay: FC<Props> = ({ date }) => {
  const displayData = useMemo(() => fromNow(date), [date]);

  return (
    <Wrapper>
      <NotificationIcon />
      <Text>{displayData}</Text>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  rowCenteredY: true,
  "& > *": {
    whiteSpace: "nowrap",
  },
});

const Text = styled("div", {
  color: "$gray700",
  body3: true,

  position: "relative",
  marginLeft: rem(4),

  "&:before": {
    content: "",
    position: "absolute",
    top: rem(0),
    right: rem(-6),
    width: rem(4),
    height: rem(4),
    borderRadius: rem(2),
    background: "$blue500",
  },
});

export default UpdatesTimeDisplay;
