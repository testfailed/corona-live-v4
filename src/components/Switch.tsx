import React, { useState } from "react";

import { rem } from "polished";

import { styled, theme } from "@styles/stitches.config";

type Props = {
  onClick: () => void;
  checked: boolean;
  small?: boolean;
};

const Switch: React.FC<Props> = ({ onClick, checked, small }) => {
  const [isTransitionEnabled, setIsTransitionEnabled] = useState(false);

  return (
    <Wrapper small={small}>
      <SwitchStyled>
        <input
          type="checkbox"
          checked={checked}
          onClick={() => {
            if (isTransitionEnabled === false) {
              setIsTransitionEnabled(true);
              setTimeout(() => {
                onClick();
              }, 0);
            } else {
              onClick();
            }
          }}
          readOnly
        />
        <Slider className="slider round" transition={isTransitionEnabled} />
      </SwitchStyled>
    </Wrapper>
  );
};

const Slider = styled("span", {
  position: "absolute",
  cursor: "pointer",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  background: "$gray100",
  borderRadius: rem(34),

  "&:before": {
    content: "",
    position: "absolute",
    height: rem(22),
    width: rem(22),
    left: rem(-6),
    top: rem(-3),
    borderRadius: "50%",
    backgroundColor: "$white",
    boxShadow: `${rem(1)} ${rem(1)} ${rem(8)} rgba(${
      theme.colors.gray900rgb
    }, 0.2), 0rem 0rem 0rem ${rem(1)} rgba(${theme.colors.gray900rgb}, 0.15)`,
  },

  variants: {
    transition: {
      true: {
        transition: "300ms",
        "&:before": {
          transition: "300ms",
        },
      },
    },
  },
});

const SwitchStyled = styled("label", {
  position: "relative",
  display: "inline-block",
  width: rem(42),
  height: rem(16),

  "& > input": {
    opacity: 0,
    width: 0,
    height: 0,

    [`&:checked + ${Slider}`]: {
      // backgroundColor: "$blue500",
      background: "rgba($gray900rgb,0.5)",
    },

    [`&:focus + ${Slider}`]: {
      boxShadow: `0 0 ${rem(1)} $blue`,
    },

    [`&:checked + ${Slider}:before`]: {
      transform: `translateX(${rem(26)})`,
    },
  },
});

const Wrapper = styled("div", {
  rowCenteredY: true,

  variants: {
    small: {
      true: {
        [`& > ${SwitchStyled}`]: {
          width: rem(32),
          height: rem(12),

          "& > input": {
            [`&:checked + ${Slider}:before`]: {
              transform: `translateX(${rem(20)})`,
            },
          },

          [`& > ${Slider}:before`]: {
            height: rem(18),
            width: rem(18),
            left: rem(-3),
            top: rem(-3),
          },
        },
      },
    },
  },
});

export default Switch;
