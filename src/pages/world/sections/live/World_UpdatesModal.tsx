import React, { useMemo } from "react";

import useApi from "@hooks/useApi";

import UpdatesContent from "@components/updates/Updates_Content";
import UpdatesModal from "@components/updates/Updates_Modal";
import WorldApi from "@apis/world-api";
import { transformWorldUpdates } from "@utils/world-util";

interface Props {}

const Content: React.FC = () => {
  const { data } = useApi(WorldApi.updates, {
    revalidateIfStale: false,
    suspense: false,
  });

  const updates = useMemo(
    () => transformWorldUpdates(data?.updates ?? []),
    [data]
  );

  return <UpdatesContent updates={updates} />;
};

const WorldUpdatesModalTrigger: React.FC<Props> = ({ children }) => {
  return (
    <UpdatesModal triggerNode={children}>
      <Content />
    </UpdatesModal>
  );
};

export default WorldUpdatesModalTrigger;
