import React from "react";

import { styled } from "@styles/stitches.config";
import Spinner from "./Spinner";

interface Props {
  text?: string;
  isLoading: boolean;
}

const LoadingText: React.FC<Props> = ({ text, isLoading, children }) => {
  return <Wrapper>{isLoading ? <Spinner /> : text ?? children}</Wrapper>;
};

const Wrapper = styled("div", {});

export default LoadingText;
