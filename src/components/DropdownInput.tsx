import React, { useState } from "react";

import { rem } from "polished";

import Child from "./Child";
import { styled } from "@styles/stitches.config";

type Props = {
  onChange: (value: string) => void;
  list: Array<string>;
};

const DropdownInput: React.FC<Props> = ({ onChange, list, children }) => {
  const [dropdownItems, setDropdownItems] = useState<Array<string>>([]);

  const onKeyUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value?.length > 1) {
      setDropdownItems(
        list?.filter((cityName) => cityName.indexOf(value) > -1)
      );
    } else {
      setDropdownItems([]);
    }
  };

  return (
    <Wrapper>
      {React.cloneElement(<Child>{children}</Child>, {
        onKeyUp,
      })}
      <Dropdown>
        {dropdownItems.map((item) => (
          <DropdownItem
            key={item}
            onClick={() => {
              onChange(item);
              setDropdownItems([]);
            }}
          >
            {item}
          </DropdownItem>
        ))}
      </Dropdown>
    </Wrapper>
  );
};

const Wrapper = styled("div", {
  column: true,
  position: "relative",
  width: "100%",
  height: "100%",
});

const Dropdown = styled("div", {
  column: true,
  position: "absolute",
  top: "100%",
  width: "100%",
  background: "$white",
  maxHeight: rem(180),
  overflowY: "scroll",
});

const DropdownItem = styled("div", {
  row: true,
  flexShrink: 0,
  padding: `${rem(12)} ${rem(10)}`,
  body3: true,

  minHeight: rem(12),
  lineHeight: rem(12),
  color: "$gray700",
  cursor: "pointer",
  borderBottom: `${rem(1)} solid $gray100`,
});

export default DropdownInput;
