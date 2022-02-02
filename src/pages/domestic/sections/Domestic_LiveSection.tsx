import React, { useMemo } from "react";

import useApi from "@hooks/useApi";
import LiveBoard, {
  LiveBoardComparedValue,
  LiveBoardSkeleton,
} from "@components/LiveBoard";
import DomesticUpdatesModalTrigger from "./domestic-live/Domestic_LiveUpdatesModal";
import DomesticApi from "@apis/domestic-api";
import { transformDomesticUpdates } from "@utils/domestic-util";
import Section from "@components/Section";

const DomesticLive: React.FC = () => {
  const { data } = useApi(DomesticApi.live);

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
      {
        label: "2주전",
        delta: data.live.today - data.live.twoWeeksAgo,
      },
      {
        label: "4주전",
        delta: data.live.today - data.live.monthAgo,
      },
    ],
    [data.live]
  );

  const updates = useMemo(
    () => transformDomesticUpdates(data.updatesPreview),
    [data.updatesPreview]
  );

  return (
    <Section>
      <LiveBoard
        currentValueLabel="오늘 확진자"
        currentValue={data.live.today}
        comparedValues={comparedValues}
        updates={updates}
        updatesModalTrigger={<DomesticUpdatesModalTrigger />}
      />
    </Section>
  );
};

export const DomesticLiveSkeleton: React.FC = () => {
  return (
    <Section>
      <LiveBoardSkeleton columns={2} />
    </Section>
  );
};

export default DomesticLive;
