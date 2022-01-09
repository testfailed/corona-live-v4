import React from "react";

import useApi from "@hooks/useApi";
import VaccinApi from "@apis/vaccine-api";
import { styled } from "@styles/stitches.config";

import Section, { SubSection } from "@components/Section";
import VaccineRatio, { VaccineRatioSkeleton } from "./ratio/Vaccine_Ratio";
import Row from "@components/Row";

const VaccineRatioSection: React.FC = () => {
  const { data } = useApi(VaccinApi.stat);

  const { partiallyVaccinated, fullyVaccinated, booster } = data!.overview;

  return (
    <>
      <Section>
        <VaccineRatio
          first={partiallyVaccinated.rates}
          second={fullyVaccinated.rates}
          third={booster.rates}
          boldText={
            <Row css={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                전체
              </div>
              <div style={{ visibility: "hidden" }}>18세 이상</div>
            </Row>
          }
          text="접종률"
          labelPosition="top"
        />
      </Section>

      <Section>
        <Wrapper>
          <SubSection>
            <VaccineRatio
              first={partiallyVaccinated.over18rates}
              second={fullyVaccinated.over18rates}
              third={booster.over18rates}
              boldText="18세 이상"
              text="접종률"
              labelPosition="top"
            />
          </SubSection>

          <VaccineRatio
            first={partiallyVaccinated.over60rates}
            second={fullyVaccinated.over60rates}
            third={booster.over60rates}
            boldText="60세 이상"
            text="접종률"
            labelPosition="top"
          />
        </Wrapper>
      </Section>
    </>
  );
};

export const VaccineRatioSectionSkeleton = () => {
  return (
    <>
      <Section>
        <VaccineRatioSkeleton />
      </Section>
      <Section>
        <Wrapper>
          <SubSection>
            <VaccineRatioSkeleton />
          </SubSection>
          <VaccineRatioSkeleton />
        </Wrapper>
      </Section>
    </>
  );
};

const Wrapper = styled("div", {
  column: true,
});

export default VaccineRatioSection;
