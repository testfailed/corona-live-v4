import React from "react";

import {
  transformDomesticUpdates,
  transformDomesticUpdatesCategories,
} from "@utils/domestic-util";
import DomesticApi from "@apis/domestic-api";

import UpdatesContent, {
  UpdatesContentSkeleton,
} from "@components/updates/Updates_Content";
import Api from "@components/Api";
import FadeIn from "@components/FadeIn";
import UpdatesModal from "@components/updates/Updates_Modal";

const DomesticLiveUpdatesModalTrigger: React.FC<{ cityId?: string }> = ({
  children,
  cityId,
}) => {
  return (
    <UpdatesModal triggerNode={children}>
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
              fallback={<UpdatesContentSkeleton hasCategories />}
            >
              <UpdatesContent {...{ updates, categories }} />
            </FadeIn>
          );
        }}
      </Api>
    </UpdatesModal>
  );
};

export default DomesticLiveUpdatesModalTrigger;
