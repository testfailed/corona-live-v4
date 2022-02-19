import React, { useMemo } from "react";

import { useParams } from "react-router-dom";

import useApi from "@hooks/useApi";

import Section from "@components/Section";
import { LiveBoard, LiveBoardSkeleton } from "@components/LiveBoard";

import { transformDomesticUpdates } from "@features/domestic/domestic-util";
import DomesticLiveUpdatesModalTrigger from "@features/domestic/components/Domestic_LiveUpdatesModal";

import CityApi from "@features/city/city-api";

import type { LiveBoardComparedValue } from "@components/LiveBoard";
import { useTranslation } from "react-i18next";

export const CityLiveSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  const params = useParams<{ cityId: string }>();

  const { data } = useApi(CityApi.live(params.cityId));

  const comparedValues: Array<LiveBoardComparedValue> = useMemo(
    () => [
      {
        label: t("live.yesterday"),
        delta: data.live.today - data.live.yesterday,
      },
      {
        label: t("live.one_week_ago"),
        delta: data.live.today - data.live.weekAgo,
      },
      {
        label: t("live.two_weeks_ago"),
        delta: data.live.today - data.live.twoWeeksAgo,
      },
      {
        label: t("live.four_weeks_ago"),
        delta: data.live.today - data.live.monthAgo,
      },
    ],
    [data.live, i18n.language]
  );

  const updates = useMemo(
    () => transformDomesticUpdates(data.updates),
    [data.updates]
  );

  return (
    <Section>
      <LiveBoard
        currentValueLabel={t("stat.confirmed_today")}
        currentValue={data.live.today}
        comparedValues={comparedValues}
        updates={updates}
        updatesModalTrigger={
          <DomesticLiveUpdatesModalTrigger cityId={params.cityId} />
        }
      />
    </Section>
  );
};

export const CityLiveSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <LiveBoardSkeleton columns={2} />
    </Section>
  );
};
