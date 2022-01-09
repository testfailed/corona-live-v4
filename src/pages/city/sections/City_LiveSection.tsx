import React, { useMemo } from "react";

import { useParams } from "react-router-dom";
import useApi from "@hooks/useApi";
import LiveBoard, {
  LiveBoardComparedValue,
  LiveBoardSkeleton,
} from "@components/LiveBoard";
import CityApi from "@apis/city-api";
import { transformDomesticUpdates } from "@utils/domestic-util";
import DomesticLiveUpdatesModalTrigger from "@pages/domestic/sections/live/Domestic_LiveUpdatesModal";
import Section from "@components/Section";

const CityLive: React.FC = () => {
  const params = useParams<{ cityId: string }>();

  const { data } = useApi(CityApi.live(params.cityId));

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
    () => transformDomesticUpdates(data.updates),
    [data.updates]
  );

  return (
    <Section>
      <LiveBoard
        currentValueLabel="현재 확진자"
        currentValue={data.live.today}
        comparedValues={comparedValues}
        updates={updates}
        updatesModalTrigger={DomesticLiveUpdatesModalTrigger}
      />
    </Section>
  );
};

export const CityLiveSkeleton: React.FC = () => {
  return (
    <Section>
      <LiveBoardSkeleton columns={2} />
    </Section>
  );
};

export default CityLive;
