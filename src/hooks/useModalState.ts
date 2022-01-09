import { useState } from "react";

export const useModalState = (intialState: boolean) => {
  const [show, setShow] = useState(intialState ?? false);

  const open = () => setShow(true);
  const close = () => setShow(false);

  return [show, open, close];
};
