import { useCallback, useEffect, useMemo, useRef } from "react";

import axios from "axios";
import create from "zustand";

import { dayjs, isInTimeRange } from "@utils/date-util";
import {
  getChartRangeLength,
  getChartRangeSlug,
  parseCompressedChartData,
} from "@utils/chart-util";

import type {
  ChartMode,
  ChartRangeOptionValue,
} from "@features/chart/chart-type";

interface State {
  data: any;
  setData: (data: any) => void;
}

const useStore = create<State>((set) => ({
  data: {},
  setData: (value) => {
    set((state) => ({ data: { ...state.data, ...value } }));
  },
}));

const fetcher = (url: string): any =>
  axios
    .get(`${url}.json?timestamp=${dayjs().valueOf()}`)
    .then(async ({ data }) => {
      return data;
    });

const useCachedChartData = (slug: string) => {
  const { data, setData } = useStore(({ data, setData }) => ({
    data,
    setData,
  }));

  const cachedRef = useRef({});

  useEffect(() => {
    if (data[slug]) cachedRef.current = data[slug];
    return () => {
      setData({ [slug]: cachedRef.current });
    };
  }, []);

  const getCachedChartData = useCallback(
    async ({
      stat,
      range,
      apiName,
      isCompressed = false,
    }: {
      stat: Array<string>;
      apiName?: string;
      range: ChartRangeOptionValue;
      isCompressed?: boolean;
      isSingle?: boolean;
    }) => {
      let rangeSlug = getChartRangeSlug(range);
      const rangeLength = getChartRangeLength(range);

      if (slug.split("/").length > 1 && rangeSlug === 90) {
        rangeSlug = "all";
      }

      let cachedData = cachedRef.current;

      const cacheData = async () => {
        const data = await fetcher(
          `${slug}/ts/${apiName ?? stat[0]}/${rangeSlug}${
            isCompressed ? "/compressed" : ""
          }`
        ).then((d) => (isCompressed ? parseCompressedChartData(d) : d));

        if (stat.length === 1) {
          cachedData[stat[0]] = data;
        } else {
          cachedData = { ...cachedData, ...data };
        }
      };

      const shouldInvalidateCache = () => {
        return isInTimeRange("09:30:00", "11:00:00");
      };

      const isNotCached = () => {
        return stat.some((k) => !cachedData[k]);
      };

      const requireLargerDataset = () => {
        return stat.every((k) => {
          const cachedDataLength = Object.keys(cachedData[k]).length;
          return rangeLength > cachedDataLength;
        });
      };

      if (isNotCached() || shouldInvalidateCache()) {
        await cacheData();
      } else {
        if (requireLargerDataset()) {
          await cacheData();
        } else {
          // console.log(`${stat} is cached`);
        }
      }

      cachedRef.current = cachedData;

      return stat.length === 1
        ? cachedData[stat[0]]
        : stat.reduce((o, k) => ({ ...o, [k]: cachedData[k] }), {});
    },
    []
  );

  return useMemo(
    () => ({ getCachedChartData, cached: cachedRef.current }),
    [getCachedChartData, cachedRef]
  );
};

export default useCachedChartData;
