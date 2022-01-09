import React, { useMemo } from "react";

import useApi from "@hooks/useApi";

import LiveBoard, {
  LiveBoardComparedValue,
  LiveBoardSkeleton,
} from "@components/LiveBoard";
import WorldLiveUpdatesModalTrigger from "./live/World_UpdatesModal";
import WorldApi from "@apis/world-api";
import { transformWorldUpdates } from "@utils/world-util";
import Section from "@components/Section";

const WorldLiveSection: React.FC = () => {
  const { data } = useApi(WorldApi.live);

  const comparedValues: Array<LiveBoardComparedValue> = useMemo(
    () => [
      {
        label: "어제",
        delta: data.live.today - data.live.yesterday,
      },
      {
        label: "1주전",
        delta: data.live.today - data.live.weekAgo,
      },
    ],
    [data.live]
  );

  const updates = useMemo(
    () => transformWorldUpdates(data.updates),
    [data.updates]
  );

  return (
    <Section>
      <LiveBoard
        currentValueLabel="오늘 확진자"
        currentValue={data.live.today}
        comparedValues={comparedValues}
        updates={updates}
        updatesModalTrigger={WorldLiveUpdatesModalTrigger}
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
