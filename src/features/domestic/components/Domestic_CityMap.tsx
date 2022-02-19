import React, { useMemo, useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";
import { css, styled } from "@styles/stitches.config";
import { formatObjectValues } from "@utils/object-util";

import Map from "@components/Map";
import Space from "@components/Space";
import { Tab, Tabs } from "@components/Tabs";

import type { MapData } from "@components/Map";
import DomesticApi from "@features/domestic/domestic-api";
import { DomesticCityStatsType } from "@features/domestic/domestic-type";

type StatType = Exclude<DomesticCityStatsType, "distanceLevel"> | "live";

const statTypes: Array<StatType> = ["live", "confirmed", "deceased"];

const DomesticCityMap: React.FC = () => {
  const { t } = useTranslation();

  const { data: live } = useApi(DomesticApi.live);
  const { data: stat } = useApi(DomesticApi.stat);

  const statTypeToLable: Partial<Record<StatType, string>> = {
    live: t("stat.confirmed_today"),
    confirmed: t("stat.confirmed"),
    deceased: t("stat.deceased"),
  };

  const [statType, setStatType] = useState<StatType>("live");

  const mapData: MapData = useMemo(
    () =>
      statType === "live"
        ? live.cities
        : formatObjectValues(stat.cities, (value) => value[statType]),
    [live, stat, statType]
  );

  return (
    <Wrapper>
      <Space h={16} />
      <Tabs
        value={statType}
        onChange={setStatType}
        tabIndicatorType="contained"
        css={css({
          background: "$gray100",
          borderRadius: rem(8),
        })}
        tabCss={css({
          height: rem(36),
          rowCentered: true,
          padding: 0,
          paddingX: rem(10),
          borderRadius: rem(8),

          "@md": {
            paddingX: rem(14),
          },
        })}
        tabTextCss={css({
          body2: true,
          color: "$gray700",
          textAlign: "centre",
        })}
        tabIndicatorTransform="scale(0.9,0.8)"
        tabIndicatorCss={css({
          borderRadius: rem(8),
          boxShadow: "$subSectionBoxShadow",
          background: "$shadowBackground2",
          border: `${rem(1)} solid $chartOptionBorder`,
        })}
        activeTabTextCss={css({
          subtitle3: true,
          color: "$gray900",
        })}
      >
        {statTypes.map((type) => (
          <Tab key={type} text={statTypeToLable[type]} value={type} />
        ))}
      </Tabs>
      <Space h={12} />
      <Map data={mapData} />
      <Space h={32} />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  columnCenteredX: true,
});

export default DomesticCityMap;
