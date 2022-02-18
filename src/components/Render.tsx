import React from "react";

interface Props {
  if: boolean;
}

const Render: React.FC<Props> = ({ if: ifTrue, children }) => {
  return ifTrue && <>{children}</>;
};

export default Render;
