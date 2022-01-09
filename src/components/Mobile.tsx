import React from "react";

import { styled } from "@styles/stitches.config";

const Mobile: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled("div", {
  "@lg": {
    display: "none",
  },
});

export default Mobile;
