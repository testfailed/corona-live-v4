import React from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";
import { styled } from "@styles/stitches.config";
import { formatObjectValues } from "@utils/object-util";

import Table from "@components/Table";

import DomesticApi from "@features/domestic/domestic-api";
import { getCityGuNameWithIds } from "@features/domestic/domestic-util";

import type { Stat } from "@_types/common-type";
import type { DomesticTableKey } from "@features/domestic/domestic-type";
import type { TableColumn, TableRow, TableRowValue } from "@components/Table";

const statToTableRowValue = (value: Stat | string): TableRowValue => {
  if (typeof value === "string") {
    return { text: value };
  }

  return {
    stat: value[0],
    delta: value[1],
  };
};

const DomesticCityTable: React.FC = () => {
  const { t } = useTranslation();

  const { data: live } = useApi(DomesticApi.live);
  const { data: stat } = useApi(DomesticApi.stat);

  const columns: Array<TableColumn<DomesticTableKey | "cityName">> = [
    {
      id: "cityName",
      name: t("city"),
      width: rem(46),
    },
    {
      id: "casesLive",
      name: t("stat.confirmed_today"),
      width: rem(112),
      sortable: true,
      defaultSortBy: true,
    },
    {
      id: "confirmed",
      name: t("stat.confirmed"),
      width: rem(132),
      sortable: true,
    },
    {
      id: "deceased",
      name: t("stat.deceased"),
      width: rem(90),
      sortable: true,
    },
    {
      id: "per100k",
      name: t("stat.confirmed_cases_per_100k"),
      width: rem(100),
      sortable: true,
    },
  ];

  type ColumnKey = typeof columns[number]["id"];

  const rows: Array<TableRow<ColumnKey>> = Object.keys(stat.cities).map(
    (_cityId) => {
      const cityId = Number(_cityId);
      const cityName = getCityGuNameWithIds(cityId);
      const { confirmed, deceased, per100k } = stat.cities[cityId];
      const casesLive = live.cities[cityId];

      const link = cityId !== 17 ? `/city/${cityId}/` : "/";

      return formatObjectValues(
        { cityName, confirmed, deceased, per100k, casesLive, link },
        statToTableRowValue
      ) as TableRow<ColumnKey>;
    }
  );

  return (
    <Wrapper>
      <Table columns={columns} rows={rows} statUnit={t("stat.unit")} />
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  overflowX: "hidden",
});

export default DomesticCityTable;
