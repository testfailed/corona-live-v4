import React, { useMemo } from "react";

import { rem } from "polished";
import { useHistory, useParams } from "react-router-dom";

import { styled } from "@styles/stitches.config";

import Section from "@components/Section";
import Skeleton from "@components/Skeleton";
import Button from "@components/Button";
import { ChevronLeftIcon } from "@components/icon/Icon_Chevron";
import { getCityGuNameWithIds } from "@features/domestic/domestic-util";

export const CityTitleSection: React.FC = () => {
  const params = useParams<{ cityId: string }>();
  const { goBack } = useHistory();

  const cityName = useMemo(() => getCityGuNameWithIds(params.cityId), [params]);

  return (
    <Section>
      <Wrapper>
        <BackButton icon onClick={goBack}>
          <ChevronLeftIcon />
        </BackButton>
        <Title>{cityName}</Title>
      </Wrapper>
    </Section>
  );
};

export const CityTitleSectionSkeleton: React.FC = () => {
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

const Title = styled("div", {
  heading2: true,
  position: "relative",
  color: "$gray900",

  "&:before": {
    content: "",
    position: "absolute",
    left: rem(2),
    bottom: rem(0),
    width: `calc(100% + ${rem(4)})`,
    height: rem(8),
    zIndex: 0,
    background: `rgba($gray900rgb, 0.1)`,
  },
});

const BackButton = styled(Button, {
  position: "absolute",
  left: rem(8),
  top: "50%",
  transform: "translateY(-50%)",
});
