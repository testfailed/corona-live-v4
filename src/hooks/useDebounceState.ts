import { useRef, useState } from "react";

const INFINITE_NUMBER = 9007199254740991;

const useDebounceState = (initialState) => {
  const [state, rawSetState] = useState(initialState);

  const intervalId = useRef<ReturnType<typeof setInterval>>(null);

  const setState = (value) => {
    if (intervalId.current === null) {
      intervalId.current = setTimeout(() => {
        rawSetState(value);
        intervalId.current = null;
      }, 250);
    } else {
      clearTimeout(intervalId.current);
      intervalId.current = null;
    }
  };

  return [state, setState];
};

export default useDebounceState;
