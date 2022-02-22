import React, { useState } from "react";

import { rem } from "polished";

import useApi from "@hooks/useApi";
import { styled } from "@styles/stitches.config";

import Section from "@components/Section";
import { Tab, Tabs } from "@components/Tabs";

import VaccinApi from "@features/vaccine/vaccine-api";

import type { VaccineType } from "@features/vaccine/vaccine-type";

export const VaccineInfoSection: React.FC = () => {
  const [vaccineType, setVaccineType] = useState<VaccineType>("pfizer");
  const { data } = useApi(VaccinApi.info);

  return (
    <Wrapper>
      <Tabs
        value={vaccineType}
        onChange={setVaccineType}
        tabIndicatorType="contained"
      >
        <Tab value="pfizer" text="화이자" />
        <Tab value="moderna" text="모더나" />
        <Tab value="jansen" text="얀센" />
        <Tab value="astrazeneca" text="AZ" />
        <Tab value="novavax" text="노바백스" />
      </Tabs>
      <Container>
        {data[vaccineType].map(([label, content], index) => (
          <Info key={index}>
            <InfoLabel>{label}</InfoLabel>
            <InfoValue dangerouslySetInnerHTML={{ __html: content }} />
          </Info>
        ))}
      </Container>
    </Wrapper>
  );
};

export const VaccineInfoSectionSkeleton = () => {
  return <Wrapper css={{ height: rem(310) }} />;
};

const Wrapper = styled(Section, {
  padding: rem(20),
});

const Container = styled("div", {
  column: true,
  paddingY: rem(6),
});

const Info = styled("div", {
  rowCenteredY: true,
  paddingX: rem(8),
  marginTop: rem(16),
});

const InfoLabel = styled("div", {
  body1: true,

  minWidth: rem(90),
  color: "$gray700",
});

const InfoValue = styled("div", {
  body1: true,
});
