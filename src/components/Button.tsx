import { styled } from "@styles/stitches.config";
import { rem } from "polished";

const Button = styled("button", {
  body3: true,

  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: 700,
  outline: "none",
  border: "none",
  borderRadius: rem(6),

  transition: "all 0.3s easeOut",
  flexShrink: "0",
  minHeight: rem(40),
  width: "100%",
  color: "$gray900",
  background: "$gray100",
  cursor: "pointer",

  variants: {
    icon: {
      true: {
        width: rem(36),
        height: rem(36),
        background: "transparent",
      },
    },
  },
});

export default Button;
