import React, { FC } from "react";

import NotificationIcon from "@components/icon/Icon_Notification";

import { styled } from "@styles/stitches.config";
import { getDateDistance } from "@utils/date-util";
import { rem } from "polished";

interface Props {
  date: string;
}
const UpdatesTimeDisplay: FC<Props> = ({ date }) => {
  return (
    <Wrapper>
      <NotificationIcon />
      <Text>{getDateDistance(date)}</Text>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  rowCenteredY: true,
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
