import { styled } from "@styles/stitches.config";

const Column = styled("div", {
  column: true,

  variants: {
    centeredY: {
      true: {
        columnCenteredY: true,
      },
    },

    centeredX: {
      true: {
        columnCenteredX: true,
      },
    },
  },
});

export default Column;
