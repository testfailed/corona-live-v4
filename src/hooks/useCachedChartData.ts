import { useCallback, useEffect, useMemo, useRef } from "react";

import axios from "axios";
import create from "zustand";

import { isInTimeRange } from "@utils/date-util";
import {
  getChartRangeLength,
  getChartRangeSlug,
  parseCompressedChartData,
} from "@utils/chart-util";

import type { ChartMode, ChartRangeOption } from "@_types/chart-type";

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
      type,
      range,
      isCompressed,
      mode,
    }: {
      type?: string;
      range: ChartRangeOption;
      isCompressed?: boolean;
      mode?: ChartMode;
    }) => {
      let rangeSlug = getChartRangeSlug(range);
      const rangeLength = getChartRangeLength(range);

      if (slug.split("/").length > 1 && rangeSlug === 90) {
        rangeSlug = "all";
      }

      const cacheData = async () => {
        const data = await fetcher(
          `${slug}/ts/${type}/${rangeSlug}${isCompressed ? "/compressed" : ""}`
        ).then((d) => (isCompressed ? parseCompressedChartData(d) : d));

        if (mode === "EXPANDED" || !type) {
          cachedRef.current = { ...cachedRef.current, ...data };
        } else {
          cachedRef.current[type] = data;
        }
      };

      const cached = cachedRef.current;

      // await fetcher("domestic/ts/all/90");
      // const test = await fetcher("domestic/ts/all/90/compressed");
      // const test = await fetcher("domestic/ts/confirmed/all/compressed");
      // parseCompressedChartData(test as any);

      if (
        !cached[type] ||
        (isInTimeRange("09:30:00", "11:00:00") &&
          type.includes("confirmed") === true)
      ) {
        await cacheData();
      } else {
        let cachedDataLength;
        if (Object.keys(cached[type])[0].match(/\d\d\d\d-\d\d-\d\d/)) {
          cachedDataLength = Object.keys(cached[type]).length;
        } else {
          let firstKey = Object.keys(cached[type])[0];
          cachedDataLength = Object.keys(cached[type][firstKey]).length;
        }

        if (cachedDataLength < rangeLength) {
          await cacheData();
        } else {
          // console.log(`${type} is cached`);
        }
      }

      return cached[type];
    },
    []
  );

  return useMemo(
    () => ({ getCachedChartData, cached: cachedRef }),
    [getCachedChartData, cachedRef]
  );
};

export default useCachedChartData;
