import React from 'react';

export function handleExtractSize(target: HTMLDivElement) {
  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = target;
  return {
    offsetWidth,
    scrollWidth,
    offsetHeight,
    scrollHeight,
  };
}

export function useThrottle<T extends any[]>(func: (...args: T) => void, delay: number) {
  const ref = React.useRef({ last: 0, func });
  ref.current.func = func;

  return React.useCallback((...args: T) => {
    const that = ref.current;
    const now = Date.now();
    if (now > that.last + delay) {
      that.last = now;
      that.func(...args);
    }
  }, []);
}
