import React from "react";

import useApi from "@hooks/useApi";
import VaccinApi from "@features/vaccine/vaccine-api";
import { styled } from "@styles/stitches.config";

import Row from "@components/Row";
import Section, { SubSection } from "@components/Section";
import VaccineRates, { VaccineRatesSkeleton } from "../Vaccine_Rates";
import { useTranslation } from "react-i18next";

export const VaccineRatesSection: React.FC = () => {
  const { t } = useTranslation();

  const { data } = useApi(VaccinApi.stat);

  const { partiallyVaccinated, fullyVaccinated, booster } = data!.overview;

  return (
    <>
      <Section>
        <VaccineRates
          first={partiallyVaccinated.rates}
          second={fullyVaccinated.rates}
          third={booster.rates}
          boldText={
            <Row css={{ position: "relative" }}>
              {t("vaccine.vaccine_rates.all").length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  {t("vaccine.vaccine_rates.all")}
                </div>
              )}
              <div style={{ visibility: "hidden" }}>
                {t("vaccine.vaccine_rates.over18")}
              </div>
            </Row>
          }
          text={t("vaccine.vaccine_rates")}
          labelPosition="top"
        />
      </Section>

      <Section>
        <Wrapper>
          <SubSection>
            <VaccineRates
              first={partiallyVaccinated.over18rates}
              second={fullyVaccinated.over18rates}
              third={booster.over18rates}
              boldText={t("vaccine.vaccine_rates.over18")}
              text={t("vaccine.vaccine_rates")}
              labelPosition="top"
            />
          </SubSection>

          <VaccineRates
            first={partiallyVaccinated.over60rates}
            second={fullyVaccinated.over60rates}
            third={booster.over60rates}
            boldText={t("vaccine.vaccine_rates.over60")}
            text={t("vaccine.vaccine_rates")}
            labelPosition="top"
          />
        </Wrapper>
      </Section>
    </>
  );
};

export const VaccineRatesSectionSkeleton = () => {
  return (
    <>
      <Section>
        <VaccineRatesSkeleton />
      </Section>
      <Section>
        <Wrapper>
          <SubSection>
            <VaccineRatesSkeleton />
          </SubSection>
          <VaccineRatesSkeleton />
        </Wrapper>
      </Section>
    </>
  );
};

const Wrapper = styled("div", {
  column: true,
});
