import React, { useState } from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";

import Space from "@components/Space";
import Section from "@components/Section";
import { Tab, Tabs } from "@components/Tabs";
import MapIcon from "@components/icon/Icon_Map";
import TableIcon from "@components/icon/Icon_Table";

import DomesticCityMap from "./city/Domestic_CityMap";
import DomesticCityTable from "./city/Domestic_CityTable";

const Domestic_CitySection: React.FC = () => {
  const [viewType, setViewType] = useState<"list" | "map">("list");

  return (
    <Section>
      <Container>
        <Tabs
          value={viewType}
          onChange={setViewType}
          tabIndicatorType="contained"
        >
          <Tab value="map" text="지도" icon={<MapIcon />} />
          <Tab value="list" text="리스트" icon={<TableIcon size={20} />} />
        </Tabs>
        <Space h={16} />
        {viewType === "map" && <DomesticCityMap />}
        {viewType === "list" && <DomesticCityTable />}
      </Container>
    </Section>
  );
};

export const DomesticCitySectionSkeleton = () => {
  return <Section css={{ height: rem(1044) }}></Section>;
};

const Container = styled("div", {
  padding: rem(12),
  paddingTop: rem(16),

  "@md": {
    padding: rem(20),
  },
});

export default Domestic_CitySection;
