import React, { useState } from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";

import Section from "@components/Section";
import { Tab, TabContainer, Tabs } from "@components/Tabs";

import type { SocialDistancingLevel } from "@features/social-distancing/social-distancing-type";

const SocialDistancingInfoSection: React.FC = () => {
  const [socialDistancingLevel, setSocialDistancingLevel] =
    useState<SocialDistancingLevel>(1);
  return (
    <Wrapper>
      <Tabs
        value={socialDistancingLevel}
        onChange={setSocialDistancingLevel}
        tabIndicatorType="contained"
      >
        <Tab value={1} text="1단계" />
        <Tab value={2} text="2단계" />
        <Tab value={3} text="3단계" />
        <Tab value={4} text="4단계" />
      </Tabs>
      <TabContainer visible={socialDistancingLevel === 1}>
        <>1</>
      </TabContainer>
      <TabContainer visible={socialDistancingLevel === 2}>
        <>2</>
      </TabContainer>
      <TabContainer visible={socialDistancingLevel === 3}>
        <>3</>
      </TabContainer>
      <TabContainer visible={socialDistancingLevel === 4}>
        <>4</>
      </TabContainer>
    </Wrapper>
  );
};

export const SocialDistancingInfoSectionSkeleton = () => {
  return <Wrapper css={{ height: rem(310) }}></Wrapper>;
};

const Wrapper = styled(Section, {
  padding: rem(20),
});

export default SocialDistancingInfoSection;
