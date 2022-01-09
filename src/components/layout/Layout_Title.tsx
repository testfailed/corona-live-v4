import React from "react";

import { styled } from "@styles/stitches.config";
import Section from "@components/Section";
import Underline from "@components/Underline";
import { rem } from "polished";

const LayoutTitle: React.FC = ({ children }) => {
  return (
    <Section>
      <Wrapper>
        <Underline>{children}</Underline>
      </Wrapper>
    </Section>
  );
};

const Wrapper = styled("div", {
  centered: true,
  paddingY: rem(12),
});

export default LayoutTitle;
