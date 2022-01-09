import React from "react";

import { styled } from "@styles/stitches.config";

const Desktop: React.FC = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled("div", {
  display: "none",
  "@lg": {
    display: "initial",
  },
});

export default Desktop;
