import React, { useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import { styled } from "@styles/stitches.config";

import Section from "@components/Section";
import { Tab, Tabs } from "@components/Tabs";
import MapIcon from "@components/icon/Icon_Map";
import TableIcon from "@components/icon/Icon_Table";
import DomesticCityMap from "../Domestic_CityMap";
import DomesticCityTable from "../Domestic_CityTable";

export const DomesticCitySection: React.FC = () => {
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

const TabsContainer = styled("div", {
  paddingX: rem(12),
  paddingY: rem(16),

  "@md": {
    paddingX: rem(20),
  },
});
