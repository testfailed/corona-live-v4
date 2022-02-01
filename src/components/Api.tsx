import useApi from "@hooks/useApi";

import type { SWRConfiguration, SWRResponse } from "swr";

const Api = <T,>({
  api,
  configs,
  children,
}: {
  api: { url: string; _t: T };
  configs?: SWRConfiguration;
  children: (props: SWRResponse<T, any>) => JSX.Element;
}) => {
  const apiResponse = useApi(api, configs);
  return children(apiResponse);
};

export default Api;
