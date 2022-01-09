import { styled } from "@styles/stitches.config";
import { rem } from "polished";

const Underline = styled("div", {
  position: "relative",
  heading2: true,

  "&:before": {
    content: "",
    position: "absolute",
    left: rem(2),
    bottom: rem(0),
    width: `calc(100% + ${rem(4)})`,
    height: rem(8),
    zIndex: 1,
    background: "$gray100",
  },
});

export default Underline;
