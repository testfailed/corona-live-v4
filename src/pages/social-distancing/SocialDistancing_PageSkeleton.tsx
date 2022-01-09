import React from "react";

import Column from "@components/Column";

import { SocialDistancingMapSectionSkeleton } from "./sections/SocialDistancing_MapSection";
import { SocialDistancingInfoSectionSkeleton } from "./sections/SocialDistancing_InfoSection";
import { SocialDistancingBannerSectionSkeleton } from "./sections/SocialDistancing_BannerSection";

const SocialDistancingPageSkeleton: React.FC = () => {
  return (
    <Column>
      <SocialDistancingBannerSectionSkeleton />
      <SocialDistancingMapSectionSkeleton />
      <SocialDistancingInfoSectionSkeleton />
    </Column>
  );
};

export default SocialDistancingPageSkeleton;
