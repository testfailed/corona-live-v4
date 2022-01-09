import React from "react";

import useApi from "@hooks/useApi";
import { useParams } from "react-router-dom";
import StatsBoard, {
  StatsBoardSkeleton,
  StatsBoardStat,
} from "@components/StatsBoard";
import CityApi from "@apis/city-api";
import Section from "@components/Section";

const CityBoard: React.FC = (props) => {
  const params = useParams<{ cityId: string }>();

  const { data } = useApi(CityApi.stat(params.cityId));

  const stats: Array<StatsBoardStat> = [
    {
      label: "확진자",
      color: "red",
      value: data.overview.confirmed[0],
      delta: data.overview.confirmed[1],
    },
    {
      label: "사망자",
      color: "grey",
      value: data.overview.deceased[0],
      delta: data.overview.deceased[1],
    },
    {
      label: "완치자",
      color: "blue",
      value: data.overview.recovered[0],
      delta: data.overview.recovered[1],
    },
    {
      label: "10만명당 확진",
      color: "grey",
      value: data.overview.per100k[0],
      delta: data.overview.per100k[1],
    },
  ];

  return (
    <Section>
      <StatsBoard stats={stats} />
    </Section>
  );
};

export const CityStatSkeleton: React.FC = () => {
  return (
    <Section>
      <StatsBoardSkeleton columns={4} />
    </Section>
  );
};

export default CityBoard;
