import React from "react";

import {
  transformDomesticUpdates,
  transformDomesticUpdatesCategories,
} from "@utils/domestic-util";
import DomesticApi from "@apis/domestic-api";

import Api from "@components/Api";
import UpdatesModal from "@components/updates/Updates_Modal";
import UpdatesContent from "@components/updates/Updates_Content";

const DomesticLiveUpdatesModalTrigger: React.FC = ({ children }) => {
  return (
    <UpdatesModal triggerNode={children}>
      <Api api={DomesticApi.updates}>
        {({ data }) => {
          const updates = transformDomesticUpdates(data?.updates ?? []);
          const categories = transformDomesticUpdatesCategories(updates);
          return data ? <UpdatesContent {...{ updates, categories }} /> : <></>;
        }}
      </Api>
    </UpdatesModal>
  );
};

export default DomesticLiveUpdatesModalTrigger;
