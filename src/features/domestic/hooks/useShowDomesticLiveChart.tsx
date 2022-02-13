import { useInterval } from "@hooks/useInterval";
import { isNotInTimeRange } from "@utils/date-util";
import { useRef, useState } from "react";

const shouldShow = () => isNotInTimeRange("09:00:00", "16:00:00");

export const useShowDomesticLiveChart = () => {
  const [showDomesticLiveChart, setShowDomesticLiveChart] = useState(() =>
    shouldShow()
  );
  const showDoemsticLiveChartRef = useRef(showDomesticLiveChart);

  useInterval(
    () => {
      const show = shouldShow();
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
