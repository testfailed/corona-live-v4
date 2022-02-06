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
import { useTranslation } from "react-i18next";

const DomesticLive: React.FC = () => {
  const { data } = useApi(DomesticApi.live);

  const { t } = useTranslation();

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
        label: t("live.one_month_ago"),
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
        currentValueLabel={t("stat.confirmed_today")}
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
