import React from "react";

import Api from "@components/Api";
import FadeIn from "@components/FadeIn";
import {
  LiveUpdatesContent,
  LiveUpdatesContentSkeleton,
} from "@components/live-updates/LiveUpdates_Content";
import UpdatesModal from "@components/live-updates/LiveUpdates_Modal";

import WorldApi from "@features/world/world-api";
import { transformWorldLiveUpdates } from "@features/world/world-util";

interface Props {}

const WorldUpdatesModalTrigger: React.FC<Props> = ({ children }) => {
  return (
    <UpdatesModal triggerNode={children}>
      <Api api={WorldApi.updates}>
        {({ data }) => {
          const updates = transformWorldLiveUpdates(data?.updates ?? []);
          return (
            <FadeIn
              show={data?.updates !== undefined}
              fallback={<LiveUpdatesContentSkeleton />}
            >
              <LiveUpdatesContent {...{ updates }} />
            </FadeIn>
          );
        }}
      </Api>
    </UpdatesModal>
  );
};

export default WorldUpdatesModalTrigger;
