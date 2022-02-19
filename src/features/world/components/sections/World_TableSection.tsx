import React, { useEffect, useMemo, useState } from "react";

import { rem } from "polished";
import { useTranslation } from "react-i18next";

import useApi from "@hooks/useApi";
import { styled } from "@styles/stitches.config";
import { ASSETS_URL } from "@constants/constants";

import Section from "@components/Section";
import Table, { TableColumn, TableRow } from "@components/Table";

import WorldApi from "@features/world/world-api";
import { WorldTableKey } from "@features/world/world-type";

const WorldTableSection: React.FC = () => {
  const { data } = useApi(WorldApi.live);
  const [rowsCount, setRowsCount] = useState(15);
  const { t, i18n } = useTranslation();

  const columns: Array<TableColumn<WorldTableKey | "index" | "countryName">> =
    useMemo(
      () => [
        {
          id: "index",
          name: "",
          width: rem(10),
        },
        {
          id: "countryName",
          name: t("country"),
          width: i18n.language === "en" ? rem(130) : rem(110),
          deltaPosition: "right",
        },

        {
          id: "confirmed",
          name: t("stat.confirmed"),
          width: rem(110),
          deltaPosition: "bottom",
        },
        {
          id: "deceased",
          name: t("stat.deceased"),
          width: rem(90),
          deltaPosition: "bottom",
        },
        {
          id: "recovered",
          name: t("stat.recovered"),
          width: rem(100),
        },
        {
          id: "casesPerMil",
          name: t("stat.confirmed_cases_per_1m"),
          width: rem(100),
        },
      ],
      [t]
    );

  type ColumnKey = typeof columns[number]["id"];

  const rows: Array<TableRow<ColumnKey>> = Object.keys(data.countries)
    .map((countryId, index) => {
      const countryName = t(countryId) === countryId ? "" : t(countryId);
      const { confirmed, deceased, recovered, casesPerMil } =
        data.countries[countryId];
      return {
        index: { text: index + 1 },
        countryName: {
          text: countryName,
          image: `${ASSETS_URL}/flags/${countryId.toLowerCase()}.svg`,
        },
        confirmed: { stat: confirmed[0], delta: confirmed[1] },
        deceased: { stat: deceased[0], delta: deceased[1] },
        recovered: { stat: recovered[0] },
        casesPerMil: { stat: casesPerMil[0] },
      };
    })
    .filter(({ countryName }) => countryName.text !== undefined)
    .sort(
      ({ confirmed: confirmedA }, { confirmed: confirmedB }) =>
        confirmedB.stat - confirmedA.stat
    )
    .slice(0, rowsCount);

  useEffect(() => {
    const loadMore = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 1500 >
        document.scrollingElement.scrollHeight
      ) {
        setRowsCount((prevRowsCount) =>
          Math.min(prevRowsCount + 30, Object.keys(data.countries).length)
        );
      }
    };

    window.addEventListener("scroll", loadMore);

    return () => {
      window.removeEventListener("scroll", loadMore);
    };
  }, []);

  return (
    <Wrapper>
      <Table
        columns={columns}
        rows={rows}
        deltaPosition="bottom"
        stickyColumnIndex={[0, 1]}
      />
    </Wrapper>
  );
};

export const WorldTableSectionSkeleton = () => {
  return <Wrapper css={{ height: rem(1605) }}></Wrapper>;
};

const Wrapper = styled(Section, {
  overflowX: "hidden",
  paddingY: rem(20),
});

export default WorldTableSection;
