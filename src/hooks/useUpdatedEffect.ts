import { useEffect, useRef } from "react";

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirst = useRef(true);

  useEffect(() => {
    if (!isFirst.current) {
      return effect();
    }

    isFirst.current = false;
  }, deps);
};

export default useUpdateEffect;
