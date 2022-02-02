import React from "react";

import WorldApi from "@apis/world-api";
import { transformWorldUpdates } from "@utils/world-util";

import Api from "@components/Api";
import FadeIn from "@components/FadeIn";
import UpdatesContent, {
  UpdatesContentSkeleton,
} from "@components/updates/Updates_Content";
import UpdatesModal from "@components/updates/Updates_Modal";

interface Props {}

const WorldUpdatesModalTrigger: React.FC<Props> = ({ children }) => {
  return (
    <UpdatesModal triggerNode={children}>
      <Api api={WorldApi.updates}>
        {({ data }) => {
          const updates = transformWorldUpdates(data?.updates ?? []);
          return (
            <FadeIn
              show={data?.updates !== undefined}
              fallback={<UpdatesContentSkeleton />}
            >
              <UpdatesContent {...{ updates }} />
            </FadeIn>
          );
        }}
      </Api>
    </UpdatesModal>
  );
};

export default WorldUpdatesModalTrigger;
