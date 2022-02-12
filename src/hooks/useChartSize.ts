import { ChartMode } from "@features/chart/chart-type";
import { useState, useEffect } from "react";

function useChartSize(config?: {
  defaultWidth?: number;
  padding?: number;
  mode?: ChartMode;
}) {
  const { defaultWidth = 500, padding = 12, mode = null } = config ?? {};
  const [chartSize, setChartSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = Math.min(
        defaultWidth - padding * 2,
        window.innerWidth - padding * 2
      );

      const height = mode === "EXPANDED" ? width / 2.7 : width / 2;
      setChartSize({
        width,
        height,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [defaultWidth, padding, mode]);

  return chartSize;
}

export default useChartSize;
