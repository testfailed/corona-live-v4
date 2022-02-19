import React, { useMemo } from "react";

import useApi from "@hooks/useApi";
import { styled } from "@styles/stitches.config";
import { formatObjectValues } from "@utils/object-util";

import Section from "@components/Section";
import Map, { MapData, MapSkeleton } from "@components/Map";

import SocialDistancingApi from "@features/social-distancing/social-distancing-api";

const SocialDistancingMapSection: React.FC = () => {
  const { data } = useApi(SocialDistancingApi.init);

  const mapData: MapData = useMemo(
    () => formatObjectValues(data.cities, ({ level }) => [level]),
    [data]
  );

  return (
    <Wrapper>
      <Map data={mapData} />
    </Wrapper>
  );
};

export const SocialDistancingMapSectionSkeleton: React.FC = () => {
  return (
    <Wrapper>
      <MapSkeleton />
    </Wrapper>
  );
};

const Wrapper = styled(Section, {});

export default SocialDistancingMapSection;
