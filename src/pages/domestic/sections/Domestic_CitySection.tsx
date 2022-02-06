import React, { useState } from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";

import Space from "@components/Space";
import Section from "@components/Section";
import { Tab, Tabs } from "@components/Tabs";
import MapIcon from "@components/icon/Icon_Map";
import TableIcon from "@components/icon/Icon_Table";

import DomesticCityMap from "./domestic-city/Domestic_CityMap";
import DomesticCityTable from "./domestic-city/Domestic_CityTable";
import { useTranslation } from "react-i18next";

const Domestic_CitySection: React.FC = () => {
  const [viewType, setViewType] = useState<"list" | "map">("list");
  const { t } = useTranslation();

  return (
    <Section>
      <TabsContainer>
        <Tabs
          value={viewType}
          onChange={setViewType}
          tabIndicatorType="contained"
        >
          <Tab
            value="map"
            text={t("domestic.city.tab.map")}
            icon={<MapIcon />}
          />
          <Tab
            value="list"
            text={t("domestic.city.tab.list")}
            icon={<TableIcon size={20} />}
          />
        </Tabs>
      </TabsContainer>
      {viewType === "map" && <DomesticCityMap />}
      {viewType === "list" && <DomesticCityTable />}
    </Section>
  );
};

export const DomesticCitySectionSkeleton = () => {
  return <Section css={{ height: rem(1044) }}></Section>;
};

const Wrapper = styled("div", {
  paddingY: rem(16),

  "@md": {
    paddingY: rem(20),
  },
});

const TabsContainer = styled("div", {
  paddingX: rem(12),
  paddingY: rem(16),

  "@md": {
    paddingX: rem(20),
  },
});

export default Domestic_CitySection;
