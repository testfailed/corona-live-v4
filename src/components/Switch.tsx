import React, { useState } from "react";

import { rem } from "polished";
import * as RadixSwitch from "@radix-ui/react-switch";

import { styled, theme } from "@styles/stitches.config";

type Props = {
  onClick: () => void;
  checked: boolean;
};

const Switch: React.FC<Props> = ({ onClick, checked, small }) => {
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);

  return (
    <Wrapper small={small}>
      <StyledSwitch defaultChecked checked={checked} onCheckedChange={onClick}>
        <StyledThumb />
      </StyledSwitch>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  rowCenteredY: true,
});

const StyledSwitch = styled(RadixSwitch.Root, {
  position: "relative",
  width: rem(40),
  height: rem(20),
  borderRadius: rem(10),
  boxShadow: "$elevation2",
  background: "$switchBackground",
  cursor: "pointer",
});

const StyledThumb = styled(RadixSwitch.Thumb, {
  display: "block",
  width: rem(18),
  height: rem(18),
  borderRadius: rem(10),

  background: "$switchThumbBackground",
  boxShadow: `${rem(1)} ${rem(1)} ${rem(8)} rgba(${
    theme.colors.gray900rgb
  }, 0.2), 0rem 0rem 0rem ${rem(1)} rgba(${theme.colors.gray900rgb}, 0.15)`,

  transition: "transform 300ms ease 0s",
  transform: "translateX(2px)",
  willChange: "transform",

  '&[data-state="checked"]': { transform: "translateX(20px)" },
});

export default Switch;
