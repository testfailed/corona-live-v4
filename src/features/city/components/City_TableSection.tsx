import React from "react";

import { styled } from "@styles/stitches.config";

import Section from "@components/Section";
import { useParams } from "react-router-dom";
import useApi from "@hooks/useApi";
import Table, { TableColumn, TableRow, TableRowValue } from "@components/Table";
import { rem } from "polished";
import { formatObjectValues } from "@utils/object-util";
import { Stat } from "@_types/common-type";
import CityApi from "@features/city/city-api";
import { getCityGuNameWithIds } from "@features/domestic/domestic-util";

const columns: Array<TableColumn<any>> = [
  {
    id: "guName",
    name: "지역",
    width: rem(66),
  },
  {
    id: "casesLive",
    name: "오늘 확진자",
    width: rem(106),
    sortable: true,
    defaultSortBy: true,
  },
  {
    id: "confirmed",
    name: "총 확진자",
    width: rem(132),
    sortable: true,
  },
];

type ColumnKey = typeof columns[number]["id"];

const statToTableRowValue = (value: Stat | string): TableRowValue => {
  if (typeof value === "string" || !value) {
    return { text: (value as string) ?? "0" };
  }

  return {
    stat: value[0],
    delta: value[1],
  };
};

export const CityTableSection: React.FC = () => {
  const params = useParams<{ cityId: string }>();

  const { data: live } = useApi(CityApi.live(params.cityId));
  const { data: stat } = useApi(CityApi.stat(params.cityId));

  const rows: Array<TableRow<ColumnKey>> = Object.keys(stat.gus).map(
    (_guId) => {
      const guId = Number(_guId);
      const guName =
        getCityGuNameWithIds(params.cityId, guId).split?.(" ")?.[1] ?? "전체";

      const confirmed = stat.gus[guId];
      const casesLive = live.gus[guId];

      return formatObjectValues(
        { guName, confirmed, casesLive },
        statToTableRowValue
      );
    }
  );

  return (
    <Wrapper>
      <Table
        columns={columns}
        rows={rows}
        statUnit="명"
        css={{ width: "100%" }}
      />
    </Wrapper>
  );
};

export const CityTableSectionSkeleton = () => {
  return <Wrapper css={{ height: rem(1605) }}></Wrapper>;
};

const Wrapper = styled(Section, {
  overflowX: "hidden",
  padding: rem(20),
});
