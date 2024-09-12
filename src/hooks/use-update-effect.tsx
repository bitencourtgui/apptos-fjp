/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param effect - The effect function to run on updates
 * @param dependencies - Dependency array that will trigger the effect when values change
 */
export const useUpdateEffect = (effect: EffectCallback, dependencies: DependencyList = []) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies); // Dependencies passed to useEffect
};
