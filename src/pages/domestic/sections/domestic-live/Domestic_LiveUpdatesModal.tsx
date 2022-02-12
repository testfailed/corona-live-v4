import React from "react";

import {
  transformDomesticUpdates,
  transformDomesticUpdatesCategories,
} from "@utils/domestic-util";
import DomesticApi from "@apis/domestic-api";

import LiveUpdatesContent, {
  LiveUpdatesContentSkeleton,
} from "@components/live-updates/LiveUpdates_Content";
import LiveUpdatesModal from "@components/live-updates/LiveUpdates_ModalTrigger";

import Api from "@components/Api";
import FadeIn from "@components/FadeIn";

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
