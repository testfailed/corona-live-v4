import React, { useMemo } from "react";

import useApi from "@hooks/useApi";
import { styled } from "@styles/stitches.config";
import { formatObjectValues } from "@utils/object-util";
import SocialDistancingApi from "@apis/social-distancing-api";

import Section from "@components/Section";
import Map, { MapData, MapSkeleton } from "@components/Map";

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
