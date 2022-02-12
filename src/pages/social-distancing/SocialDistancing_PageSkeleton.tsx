import React from "react";

import Column from "@components/Column";

import { SocialDistancingMapSectionSkeleton } from "../../features/social-distancing/components/sections/SocialDistancing_MapSection";
import { SocialDistancingInfoSectionSkeleton } from "../../features/social-distancing/components/sections/SocialDistancing_InfoSection";
import { SocialDistancingBannerSectionSkeleton } from "../../features/social-distancing/components/SocialDistancing_BannerSection";

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
