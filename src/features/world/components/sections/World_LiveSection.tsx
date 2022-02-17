import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";

import { LiveBoard, LiveBoardSkeleton } from "@components/LiveBoard";
import Section from "@components/Section";

import WorldApi from "@features/world/world-api";
import { transformWorldLiveUpdates } from "@features/world/world-util";
import WorldLiveUpdatesModalTrigger from "@features/world/components/World_UpdatesModal";

import type { LiveBoardComparedValue } from "@components/LiveBoard";

const WorldLiveSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { data } = useApi(WorldApi.live);

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
    ],
    [data.live, i18n.language]
  );

  const updates = useMemo(
    () => transformWorldLiveUpdates(data.updates),
    [data.updates, i18n.language]
  );

  return (
    <Section>
      <LiveBoard
        currentValueLabel={t("stat.confirmed_today")}
        currentValue={data.live.today}
        comparedValues={comparedValues}
        updates={updates}
        updatesModalTrigger={<WorldLiveUpdatesModalTrigger />}
      />
    </Section>
  );
};

export const WorldLiveSectionSkeleton: React.FC = () => {
  return (
    <Section>
      <LiveBoardSkeleton columns={1} />
    </Section>
  );
};

export default WorldLiveSection;
