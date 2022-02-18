import { dayjs } from "@utils/date-util";
import axios from "axios";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

export const fetcher = (url: string) =>
  axios
    .get(`${url}.json?timestamp=${dayjs().valueOf()}`)
    .then(async ({ data }) => {
      return data;
    });

const useApi = <T>(
  { url }: { url: string; _t: T },
  configs?: SWRConfiguration
) => {
  const response = useSWR(url, fetcher, {
    suspense: false,
    ...configs,
  });

  return response as SWRResponse<T, any>;
};

export default useApi;
