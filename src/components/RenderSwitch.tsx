import React from "react";

interface Props<T extends string> {
  value: T;
  cases: Partial<Record<T | "_", React.ReactNode>>;
}

const RenderSwitch = <T extends string>({
  cases,
  value,
}: Props<T>): JSX.Element => {
  return (
    <>
      {cases[value] !== undefined ? (
        cases[value]
      ) : cases["_"] !== undefined ? (
        cases["_"]
      ) : (
        <></>
      )}
    </>
  );
};

export default RenderSwitch;
