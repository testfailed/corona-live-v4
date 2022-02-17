import { useRef, useState } from "react";

import { useInterval } from "@hooks/useInterval";
import { isNotInTimeRange } from "@utils/date-util";

const shouldShowDomesticLiveChart = () =>
  isNotInTimeRange("09:00:00", "16:30:00");

export const useShowDomesticLiveChart = () => {
  const [showDomesticLiveChart, setShowDomesticLiveChart] = useState(() =>
    shouldShowDomesticLiveChart()
  );
  const showDoemsticLiveChartRef = useRef(showDomesticLiveChart);

  useInterval(
    () => {
      const show = shouldShowDomesticLiveChart();
      if (show) {
        if (showDoemsticLiveChartRef.current === false) {
          setShowDomesticLiveChart(true);
          showDoemsticLiveChartRef.current = true;
        }
      } else {
        if (showDoemsticLiveChartRef.current === true) {
          setShowDomesticLiveChart(false);
          showDoemsticLiveChartRef.current = false;
        }
      }
    },
    5000,
    []
  );

  return showDomesticLiveChart;
};
