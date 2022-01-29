import React, { useMemo } from "react";

import useApi from "@hooks/useApi";

import UpdatesModal from "@components/updates/Updates_Modal";
import UpdatesContent from "@components/updates/Updates_Content";
import DomesticApi from "@apis/domestic-api";
import {
  transformDomesticUpdates,
  transformDomesticUpdatesCategories,
} from "@utils/domestic-util";

const Content: React.FC = () => {
  const { data } = useApi(DomesticApi.updates, {
    revalidateIfStale: false,
    suspense: false,
  });

  const updates = useMemo(
    () => transformDomesticUpdates(data?.updates ?? []),
    [data]
  );

  const categories = useMemo(
    () => transformDomesticUpdatesCategories(updates),
    [updates]
  );

  return <UpdatesContent updates={updates} categories={categories} />;
};

const DomesticLiveUpdatesModalTrigger: React.FC = ({ children }) => {
  return (
    <UpdatesModal triggerNode={children}>
      <Content />
    </UpdatesModal>
  );
};

export default DomesticLiveUpdatesModalTrigger;
