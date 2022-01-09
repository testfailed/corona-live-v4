import React from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";

import Section from "@components/Section";
import Skeleton from "@components/Skeleton";

const SocialDistancingBannerSection: React.FC = () => {
  return (
    <Section>
      <Wrapper></Wrapper>
    </Section>
  );
};

export const SocialDistancingBannerSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <Wrapper>
        <Skeleton w={46} h={24} />
      </Wrapper>
    </Section>
  );
};

const Wrapper = styled("div", {
  centered: true,
  height: rem(58),
  position: "relative",
});

export default SocialDistancingBannerSection;
