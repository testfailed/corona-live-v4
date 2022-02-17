import React, { useMemo, useState } from "react";

import { styled } from "@styles/stitches.config";
import { createEmptyArray } from "@utils/array-util";

import LiveUpdatesCategories, {
  UpdatesCategoriesSkeleton,
} from "@components/live-updates/LiveUpdates_Categories";
import {
  LiveUpdatesRow,
  ILiveUpdatesRow,
  LiveUpdatesRowSkeleton,
} from "@components/live-updates/LiveUpdates_Row";

import type { IUpdatesCategory } from "@components/live-updates/LiveUpdates_Categories";

interface Props {
  updates: Array<ILiveUpdatesRow>;
  categories?: Array<IUpdatesCategory>;
  triggerNode?: React.ReactNode;
}

export const LiveUpdatesContent: React.FC<Props> = ({
  updates,
  categories,
}) => {
  const [category, setCategory] = useState(null);

  const filteredUpdates = useMemo(
    () =>
      category === null
        ? updates
        : updates.filter((update) => update.category === category),
    [category, updates]
  );

  return (
    <Wrapper>
      {categories && (
        <LiveUpdatesCategories
          categories={categories}
          value={category}
          onChange={setCategory}
        />
      )}
      {filteredUpdates && (
        <Container>
          {filteredUpdates?.map((update, index) => {
            return (
              <LiveUpdatesRow key={`${update.date}/${index}`} {...update} />
            );
          })}
        </Container>
      )}
    </Wrapper>
  );
};

export const LiveUpdatesContentSkeleton: React.FC<{
  hasCategories?: boolean;
}> = (props) => {
  return (
    <Wrapper>
      {props.hasCategories && <UpdatesCategoriesSkeleton />}
      <Container>
        {createEmptyArray(20).map(() => (
          <LiveUpdatesRowSkeleton />
        ))}
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  column: true,
  height: "inherit",
  flex: 1,
});

const Container = styled("div", {
  column: true,
  overflowY: "auto",
  flex: 1,
  "&::-webkit-scrollbar": {
    width: 0,
    background: "transparent",
  },
});
