import React, { useMemo } from "react";

import useApi from "@hooks/useApi";
import WorldApi from "@features/world/world-api";
import { transformWorldLiveUpdates } from "@utils/world-util";

import LiveBoard, {
  LiveBoardComparedValue,
  LiveBoardSkeleton,
} from "@components/LiveBoard";
import Section from "@components/Section";
import WorldLiveUpdatesModalTrigger from "../World_UpdatesModal";
import { useTranslation } from "react-i18next";

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
