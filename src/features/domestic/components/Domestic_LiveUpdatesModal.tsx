import React from "react";

import {
  transformDomesticUpdates,
  transformDomesticUpdatesCategories,
} from "@features/domestic/domestic-util";
import DomesticApi from "@features/domestic/domestic-api";

import {
  LiveUpdatesContent,
  LiveUpdatesContentSkeleton,
} from "@components/live-updates/LiveUpdates_Content";
import LiveUpdatesModal from "@components/live-updates/LiveUpdates_Modal";

import Api from "@components/Api";
import FadeIn from "@components/FadeIn";

import { dayjs } from "@utils/date-util";

const DomesticLiveUpdatesModalTrigger: React.FC<{ cityId?: string }> = ({
  children,
  cityId,
}) => {
  return (
    <LiveUpdatesModal triggerNode={children}>
      <Api api={DomesticApi.updates}>
        {({ data }) => {
          const rawUpdates = transformDomesticUpdates(data?.updates ?? []);

          const updates =
            cityId === undefined
              ? rawUpdates
              : rawUpdates.filter(
                  ({ category }) => Number(category) === Number(cityId)
                );

          const categories =
            cityId === undefined
              ? transformDomesticUpdatesCategories(updates)
              : undefined;

          return (
            <FadeIn
              show={data?.updates !== undefined}
              fallback={<LiveUpdatesContentSkeleton hasCategories />}
              id={dayjs().valueOf().toString()}
            >
              <LiveUpdatesContent {...{ updates, categories }} />
            </FadeIn>
          );
        }}
      </Api>
    </LiveUpdatesModal>
  );
};

export default DomesticLiveUpdatesModalTrigger;
