import { styled } from "@styles/stitches.config";

const Row = styled("div", {
  row: true,

  variants: {
    centeredY: {
      true: {
        rowCenteredY: true,
      },
    },

    centeredX: {
      true: {
        rowCenteredX: true,
      },
    },
  },
});

export default Row;
