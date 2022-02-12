import React, { useMemo } from "react";

import { rem } from "polished";

import { styled } from "@styles/stitches.config";
import { createEmptyArray } from "@utils/array-util";

import Skeleton from "@components/Skeleton";

export interface IUpdatesCategory {
  text: string;
  value: string;
  count: number;
}

interface Props {
  categories: Array<IUpdatesCategory>;
  value: string;
  onChange: (value: string) => void;
}

const UpdatesCategories: React.FC<Props> = ({
  categories,
  value,
  onChange,
}) => {
  const sortedCategories = useMemo(
    () => categories.sort((a, b) => b.count - a.count),
    [categories]
  );

  return (
    <Wrapper>
      {sortedCategories.map((category) => (
        <Category
          key={category.value}
          active={category.value === value}
          onClick={() => onChange(category.value)}
        >
          {category.text}
          {category.count > 0 && (
            <CategoryCount>{category.count}</CategoryCount>
          )}
        </Category>
      ))}
    </Wrapper>
  );
};

export const UpdatesCategoriesSkeleton: React.FC = () => {
  return (
    <Wrapper>
      {createEmptyArray(10).map(() => (
        <Skeleton w={62} h={30} marginBottom={8} marginRight={6} />
      ))}
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  rowCenteredY: true,
  overflowX: "scroll",
  marginBottom: rem(6),
  flexShrink: 0,
});

const Category = styled("div", {
  rowCenteredY: true,
  paddingX: rem(10),
  paddingY: rem(6),
  borderRadius: rem(6),
  marginRight: rem(6),
  marginBottom: rem(8),
  transition: "0.3s",
  background: "$gray100",
  color: "$gray700",
  flexShrink: 0,
  body3: true,

  cursor: "pointer",
  border: `${rem(1)} solid $white`,

  variants: {
    active: {
      true: {
        color: "$gray900",
        background: "$white",
        border: `${rem(1)} solid $gray500`,
        boxShadow: "$elevation1",
      },
    },
  },
});

const CategoryCount = styled("div", {
  fontWeight: 700,
  paddingLeft: rem(4),
});

export default UpdatesCategories;
