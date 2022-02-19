import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";

import Section from "@components/Section";
import { LiveBoard, LiveBoardSkeleton } from "@components/LiveBoard";

import DomesticApi from "@features/domestic/domestic-api";
import { transformDomesticUpdates } from "@features/domestic/domestic-util";
import DomesticUpdatesModalTrigger from "@features/domestic/components/Domestic_LiveUpdatesModal";

import type { LiveBoardComparedValue } from "@components/LiveBoard";

export const DomesticLiveSection: React.FC = () => {
  const { data } = useApi(DomesticApi.live);

  const { t, i18n } = useTranslation();

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
    [data.live, i18n.resolvedLanguage]
  );

  const updates = useMemo(
    () => transformDomesticUpdates(data.updatesPreview),
    [data.updatesPreview, i18n.resolvedLanguage]
  );

  return (
    <Section>
      <LiveBoard
        currentValueLabel={t("stat.confirmed_today")}
        currentValue={data.live.today}
        comparedValues={comparedValues}
        updates={updates}
        updatesModalTrigger={<DomesticUpdatesModalTrigger />}
      />
    </Section>
  );
};

export const DomesticLiveSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <LiveBoardSkeleton columns={2} />
    </Section>
  );
};
