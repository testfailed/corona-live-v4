import { useCallback, useEffect, useMemo, useRef } from "react";

import create from "zustand";

import { fetcher } from "@hooks/useApi";

import {
  CompressedChartData,
  getChartRangeLength,
  getChartRangeSlug,
  parseCompressedChartData,
} from "@features/chart/chart-util";

import type { ChartRangeOptionValue } from "@features/chart/chart-type";

const useCachedChartDataStore = create<{
  data: any;
  setData: (data: any) => void;
}>((set) => ({
  data: {},
  setData: (value) => {
    set((state) => ({ data: { ...state.data, ...value } }));
  },
}));

const useCachedChartData = <MainOption extends string>(slug: string) => {
  const { data, setData } = useCachedChartDataStore(({ data, setData }) => ({
    data,
    setData,
  }));

  const cachedRef = useRef<Partial<Record<MainOption, any>>>({});

  useEffect(() => {
    cachedRef.current = data[slug] ?? cachedRef.current;
    return () => {
      setData({ [slug]: cachedRef.current });
    };
  }, []);

  const getCachedChartData = useCallback(
    async ({
      mainOptions,
      range,
      apiName = mainOptions?.[0],
      isCompressed = false,
      shouldInvalidate = false,
    }: {
      mainOptions: Array<MainOption>;
      apiName?: string;
      range: ChartRangeOptionValue;
      isCompressed?: boolean;
      shouldInvalidate?: boolean;
    }) => {
      if (Object.keys(cachedRef.current).length === 0)
        cachedRef.current = data[slug] ?? cachedRef.current;
      let cachedData = cachedRef.current;

      let rangeSlug = getChartRangeSlug(range);
      let rangeLength = getChartRangeLength(range);

      if (slug.split("/").length > 1 && rangeSlug === 90) {
        rangeSlug = "all";
      }

      const cacheData = async () => {
        if (!rangeSlug) return;

        const apiPath = `${slug}/ts/${apiName}/${rangeSlug}${
          isCompressed ? "/compressed" : ""
        }`;

        const data = (await fetcher(apiPath).then((d) =>
          isCompressed ? parseCompressedChartData(d as CompressedChartData) : d
        )) as Record<MainOption, any>;

        if (mainOptions.length === 1) {
          cachedData[mainOptions[0]] = data;
        } else {
          cachedData = { ...cachedData, ...data };
        }
      };

      const isNotCached = () => {
        return mainOptions.some((k) => !cachedData[k]);
      };

      const shouldFetchLargerDataset = () => {
        return mainOptions.every((k) => {
          const cachedDataLength = Object.keys(cachedData[k]).length;
          return rangeLength > cachedDataLength;
        });
      };

      if (isNotCached() || shouldInvalidate) {
        await cacheData();
      } else {
        if (shouldFetchLargerDataset()) {
          await cacheData();
        } else {
          // console.log(`${stat} is cached`);
        }
      }

      cachedRef.current = cachedData;

      return mainOptions.length === 1
        ? cachedData[mainOptions[0]]
        : mainOptions.reduce((o, k) => ({ ...o, [k]: cachedData[k] }), {});
    },
    []
  );

  return useMemo(() => ({ getCachedChartData }), [getCachedChartData]);
};

export default useCachedChartData;
