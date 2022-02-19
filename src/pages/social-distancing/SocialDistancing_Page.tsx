import React from "react";

import useApi from "@hooks/useApi";
import { WEB_URL } from "@constants/constants";
import SocialDistancingApi from "@features/social-distancing/social-distancing-api";
import { SOCIAL_DISTANCING_PATH } from "@constants/route-constants";

import Seo from "@components/Seo";
import Column from "@components/Column";
import Suspense from "@components/FadeIn";

import SocialDistancingPageSkeleton from "./SocialDistancing_PageSkeleton";
import SocialDistancingMapSection from "@features/social-distancing/components/SocialDistancing_MapSection";
import SocialDistancingInfoSection from "@features/social-distancing/components/SocialDistancing_InfoSection";
import SocialDistancingBannerSection from "@features/social-distancing/components/SocialDistancing_BannerSection";

const SocialDistancingPage: React.FC = (props) => {
  const { data } = useApi(SocialDistancingApi.init);
  return (
    <>
      <Seo
        title={`코로나 라이브 | 거리 두기 단계`}
        description={"지역별 거리 두기 단계 제공합니다"}
        canonical={`${WEB_URL}${SOCIAL_DISTANCING_PATH}`}
      />

      <Suspense
        show={data !== undefined}
        fallback={<SocialDistancingPageSkeleton />}
      >
        <Column>
          <SocialDistancingBannerSection />
          <SocialDistancingMapSection />
          <SocialDistancingInfoSection />
        </Column>
      </Suspense>
    </>
  );
};

export default SocialDistancingPage;
