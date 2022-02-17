import React, { useEffect, useRef } from "react";

import { SWRConfiguration } from "swr";

import useApi from "@hooks/useApi";
import CommonApi from "@apis/common-api";

import WorldApi from "@features/world/world-api";
import DomesticApi from "@features/domestic/domestic-api";
import { useDomesticChartForceUpdateStore } from "@features/domestic/components/sections/Domestic_ChartSection";

const configs: SWRConfiguration = {
  suspense: false,
  revalidateOnReconnect: false,
  revalidateOnFocus: false,
  revalidateOnMount: false,
};

const MutationHandler: React.FC = () => {
  const lastUpdatedTime = useRef<string | null>(null);
  const { data } = useApi(CommonApi.lastUpdated, {
    suspense: false,
    refreshInterval: 5000,
  });

  const { mutate: mutateAnnouncement } = useApi(
    CommonApi.announcement,
    configs
  );
  const { mutate: mutateNotification } = useApi(
    CommonApi.notification,
    configs
  );
  const { mutate: mutateDomesticStat } = useApi(DomesticApi.stat, configs);
  const { mutate: mutateDomesticLive } = useApi(DomesticApi.live, configs);
  const { mutate: mutateWorldLive } = useApi(WorldApi.live, configs);

  const { forceUpdate } = useDomesticChartForceUpdateStore(
    ({ forceUpdate }) => ({ forceUpdate })
  );

  useEffect(() => {
    if (data !== undefined) {
      if (
        lastUpdatedTime.current !== null &&
        lastUpdatedTime.current !== data.datetime
      ) {
        switch (data.type) {
          case "ANNOUNCEMENT":
            mutateAnnouncement();
            break;

          case "NOTIFICATION":
            mutateNotification();
            mutateDomesticLive();
            break;

          case "DOMESTIC_LIVE":
            mutateDomesticLive();
            break;
          case "DOMESTIC_STAT":
            mutateDomesticStat();
            break;
          case "DOMESTIC_TS":
            forceUpdate();
            break;

          case "WORLD_LIVE":
          case "WORLD_STAT":
            mutateWorldLive();
            break;
          case "REFRESH":
            // window.location.reload(true);
            break;

          default:
            break;
        }
      }

      lastUpdatedTime.current = data.datetime!;
    }
  }, [data]);

  return <></>;
};

export default MutationHandler;
