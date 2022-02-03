import { rem } from "polished";

import { styled, theme } from "@styles/stitches.config";

const Section = styled("section", {
  background: "$white",

  width: "100%",
  overflow: "hidden",
  flexShrink: 0,
  boxShadow: `rgb(0 0 0 / 2%) ${rem(-1)} ${rem(1)} ${rem(1)}`,
  marginBottom: rem(9),

  "@md": {
    marginBottom: rem(22),
    borderRadius: rem(12),

    border: `${rem(1)} solid $sectionBorder`,

    boxShadow: "$elevation1",
  },

  variants: {
    border: {
      true: {
        borderRadius: rem(12),
        border: `${rem(1)} solid $sectionBorder`,
        boxShadow: "$elevation1",
      },
    },
  },
});

export const SubSection = styled("div", {
  as: "div",
  width: `calc(100% + ${rem(2)})`,
  transform: `translate(${rem(-1)}, ${rem(-1)})`,
  marginBottom: 0,
  boxShadow: "$subSectionBoxShadow",

  "@md": {
    borderRadius: `${rem(12)} ${rem(12)} 0 0`,
    border: `${rem(1)} solid $subSectionBorder`,
  },
});

export default Section;
