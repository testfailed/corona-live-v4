import React, { useMemo, useState } from "react";

import { styled } from "@styles/stitches.config";

import UpdatesCategories, {
  UpdatesCategory,
} from "@components/updates/Updates_Categories";
import UpdatesRow, { UpdateRow } from "@components/updates/Updates_Row";

interface Props {
  updates: Array<UpdateRow>;
  categories?: Array<UpdatesCategory>;
  triggerNode?: React.ReactNode;
}

const UpdatesContent: React.FC<Props> = ({ updates, categories }) => {
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
        <UpdatesCategories
          categories={categories}
          value={category}
          onChange={setCategory}
        />
      )}
      {filteredUpdates && (
        <Container>
          {filteredUpdates?.map((update) => (
            <UpdatesRow key={update.date} {...update} />
          ))}
        </Container>
      )}
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

export default UpdatesContent;
