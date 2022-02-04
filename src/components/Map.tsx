import React, { useEffect, useMemo, useRef } from "react";

import useSWR from "swr";

import { json } from "d3-fetch";
import * as topojson from "topojson";
import { select } from "d3-selection";
import { geoPath, geoMercator } from "d3-geo";

import DeltaTag from "./DeltaTag";
import { numberWithCommas } from "@utils/number-util";
import { styled, theme } from "@styles/stitches.config";
import { Stat } from "@_types/common-type";
import { rem } from "polished";

const [width, height] = [432, 488];

export const MAP_POINTS = {
  서울: [155, 160],
  부산: [250, 390],
  대구: [220, 285],
  인천: [55, 130],
  광주: [140, 390],
  대전: [165, 242],
  울산: [290, 350],
  세종: [110, 225],
  경기: [120, 90],
  강원: [240, 108],
  충북: [220, 180],
  충남: [60, 270],
  전북: [125, 310],
  전남: [70, 400],
  경북: [275, 230],
  경남: [195, 360],
  제주: [100, 540],
  검역: [284, 468],
};

export interface MapData {
  [cityId: string]: Stat;
}

interface Props {
  data: MapData;
}

const Map: React.FC<Props> = ({ data }) => {
  const mapRef = useRef<SVGSVGElement>(null);

  const { data: geoData } = useSWR(
    "https://assets.corona-live.com/maps/korea.json",
    async (file) => {
      // alert("map file fetched succes");
      return await json(file);
    },
    { suspense: false, revalidateOnFocus: false }
  );

  const path = useMemo(() => {
    if (!geoData) return null;
    const projection = geoMercator().fitSize(
      [width, height],
      topojson.feature(geoData, geoData.objects.regions)
    );

    return geoPath().projection(projection);
  }, [geoData]);

  const features = useMemo(() => {
    if (!geoData) return null;
    return topojson.feature(geoData, geoData.objects.regions).features;
  }, [geoData]);

  useEffect(() => {
    if (!geoData) return;
    const $map = select(mapRef.current);

    const maxCases = Math.max(
      ...Object.keys(data).map((cityId) => data[cityId][0])
    );

    $map
      .select(".regions")
      .selectAll("path")
      .data(features)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("d", path)
            .attr("strokeWidth", 1)
            .attr("stroke-opacity", 0.5)
            .attr("fill", (d) => {
              const cityId = d.properties.code;
              const opacity =
                0.1 + Math.max(data[cityId][0] / maxCases - 0.1, 0);
              return `rgb(86, 115, 235,${opacity})`;
            })
            .attr("stroke", theme.colors.mapStroke.computedValue)
            .style("cursor", "pointer"),
        (update) =>
          update
            .attr("stroke", theme.colors.mapStroke.computedValue)
            .style("cursor", "pointer")
            .attr("fill", (d) => {
              const cityId = d.properties.code;
              const opacity =
                0.1 + Math.max(data[cityId][0] / maxCases - 0.1, 0);
              return `rgb(86, 115, 235,${opacity})`;
            })
      );
  }, [geoData, features, path, data]);

  return (
    <Wrapper>
      {features &&
        features.map((f, i) => {
          const { name: cityName, code: cityId } = f.properties;
          const pos = MAP_POINTS[cityName];
          const [left, top] = pos;
          const stat = data[cityId];

          return (
            <FloatingBox
              css={{ left, top }}
              key={`${cityId}/${stat}`}
              transparent={stat[0] === 0}
            >
              <CityName>{cityName}</CityName>
              <CityCases>{numberWithCommas(stat[0])}</CityCases>
              {!!stat[1] && <DeltaTag small delta={stat[1]} />}
            </FloatingBox>
          );
        })}

      <MapSvg
        viewBox={`50 0 ${width - 150} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        id="chart"
        ref={mapRef}
      >
        <g className="regions" />
        <g className="labels" />
        <g className="state-borders" />
        <g className="district-borders" />
      </MapSvg>

      <Dokdo />
    </Wrapper>
  );
};

export const MapSkeleton: React.FC = () => {
  const mapRef = useRef<SVGSVGElement>(null);

  const { data: geoData } = useSWR(
    "https://assets.corona-live.com/maps/korea.json",
    async (file) => {
      return await json(file);
    },
    { suspense: false, revalidateOnFocus: false }
  );

  const path = useMemo(() => {
    if (!geoData) return null;
    const projection = geoMercator().fitSize(
      [width, height],
      topojson.feature(geoData, geoData.objects.regions)
    );

    return geoPath().projection(projection);
  }, [geoData]);

  const features = useMemo(() => {
    if (!geoData) return null;
    return topojson.feature(geoData, geoData.objects.regions).features;
  }, [geoData]);

  useEffect(() => {
    if (!geoData) return;
    const $map = select(mapRef.current);

    $map
      .select(".regions")
      .selectAll("path")
      .data(features)
      .join((enter) =>
        enter
          .append("path")
          .attr("d", path)
          .attr("strokeWidth", 1)
          .attr("stroke-opacity", 1)
          .attr("stroke", theme.colors.mapStroke.computedValue)
          .attr("fill", theme.colors.gray100)
      );
  }, [geoData, path]);

  return (
    <Wrapper>
      <MapSvg
        viewBox={`50 0 ${width - 150} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        ref={mapRef}
      >
        <g className="regions" />
      </MapSvg>

      <Dokdo />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  position: "relative",
  margin: "auto",
  marginBottom: rem(-50),
  marginTop: rem(-10),
  display: "block",
  overflow: "hidden",
  width: rem(360),
});

const MapSvg = styled("svg", {
  fadeInUp: true,
});

const FloatingBox = styled("div", {
  fadeInUpCentered: true,
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  background: "$mapLabelBackground",
  borderRadius: rem(12),
  paddingY: rem(4),
  paddingX: rem(6),
  boxShadow: `0 0 ${rem(6)} #00000025`,
  lineHeight: rem(18),
  transform: "translate3d(-50%, -50%, 0rem)",
  zIndex: "2",
  cursor: "pointer",

  variants: {
    transparent: {
      true: {
        opacity: 0.5,
      },
    },
  },
});

const CityName = styled("div", {
  body3: true,

  marginBottom: rem(2),
  color: "$gray900",
});

const CityCases = styled("div", {
  subtitle3: true,

  marginBottom: rem(1),
});

const DokdoContainer = styled("div", {
  position: "absolute",
  width: rem(22),
  height: rem(22),
  zIndex: 1,
  right: rem(28),
  top: rem(172),

  "& svg": {
    width: "100%",
    height: "100%",
  },
});

const Dokdo = () => (
  <DokdoContainer>
    <svg
      width="748.555"
      height="437.018"
      viewBox="0 0 748.555 437.018"
      fill="rgb(86, 115, 235, 0.15)"
    >
      <g
        id="Group_67"
        data-name="Group 67"
        transform="translate(-1120.207 -2549.625)"
      >
        <path
          d="M6688.883,1711.255c-8.228,50.384,1.3,88.118,40.151,120.585s123.4,84.733,165.436,74.049,109.233-31.348,114.775-47.211,53.966-132.664,47.167-182.976-28.313-87.428-93.842-95.715-164.993,25.6-200.626,50.32S6697.11,1660.872,6688.883,1711.255Z"
          transform="translate(-5563 974)"
          strokeWidth="40"
          stroke={theme.colors.mapStroke.computedValue}
        />
        <path
          d="M7293.052,1852.887c-13.152,22.2-32.658,117.672-2.672,148.827s131.109-40.509,131.109-40.509,16.327-68.508,0-87.713S7306.2,1830.687,7293.052,1852.887Z"
          transform="translate(-5563 974)"
          strokeWidth="40"
          stroke={theme.colors.mapStroke.computedValue}
        />
      </g>
    </svg>
  </DokdoContainer>
);

export default Map;
