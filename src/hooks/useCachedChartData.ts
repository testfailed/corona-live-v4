import { useCallback, useEffect, useMemo, useRef } from "react";

import axios from "axios";
import create from "zustand";

import { isInTimeRange } from "@utils/date-util";
import {
  getChartRangeLength,
  getChartRangeSlug,
  parseCompressedChartData,
} from "@utils/chart-util";

import type { ChartMode, ChartRangeOptionValue } from "@_types/chart-type";

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
    .get(`${url}.json?timestamp=${new Date().getTime()}`)
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
      isCompressed = false,
      isSingle = true,
    }: {
      stat?: string;
      range: ChartRangeOptionValue;
      isCompressed?: boolean;
      isSingle?: boolean;
    }) => {
      let rangeSlug = getChartRangeSlug(range);
      const rangeLength = getChartRangeLength(range);

      if (slug.split("/").length > 1 && rangeSlug === 90) {
        rangeSlug = "all";
      }

      let keys: Array<string> = [];
      let cachedData = cachedRef.current;

      const cacheData = async () => {
        const data = await fetcher(
          `${slug}/ts/${stat}/${rangeSlug}${isCompressed ? "/compressed" : ""}`
        ).then((d) => (isCompressed ? parseCompressedChartData(d) : d));

        if (isSingle) {
          cachedData[stat] = data;
        } else {
          cachedData = { ...cachedData, ...data };
          keys = Object.keys(data);
        }
      };

      const isNotCached = () => {
        if (isSingle) {
          return !cachedData[stat];
        } else {
          return keys.some((k) => !cachedData[k]);
        }
      };
      const shouldInvalidateCache = () => {
        return (
          isInTimeRange("09:30:00", "11:00:00") &&
          stat.includes("confirmed") === true
        );
      };

      const requireLargerDataset = () => {
        let cachedDataLength;
        if (Object.keys(cachedData[stat])[0].match(/\d\d\d\d-\d\d-\d\d/)) {
          cachedDataLength = Object.keys(cachedData[stat]).length;
        } else {
          const firstKey = Object.keys(cachedData[stat])[0];
          cachedDataLength = Object.keys(cachedData[stat][firstKey]).length;
        }
        return cachedDataLength < rangeLength;
      };

      if (isNotCached() || shouldInvalidateCache) {
        await cacheData();
      } else {
        if (requireLargerDataset()) {
          await cacheData();
        } else {
          console.log(`${stat} is cached`);
        }
      }

      cachedRef.current = cacheData;

      return isSingle
        ? cachedData[stat]
        : keys.reduce((o, k) => ({ ...o, [k]: cachedData[k] }), {});
    },
    []
  );

  return useMemo(
    () => ({ getCachedChartData, cached: cachedRef.current }),
    [getCachedChartData, cachedRef]
  );
};

export default useCachedChartData;
