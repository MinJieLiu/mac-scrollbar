import React from 'react';

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

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  fn: (evt: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  const funcRef = React.useRef(fn);
  funcRef.current = fn;

  React.useEffect(() => {
    window.addEventListener(type, funcRef.current, options);

    return () => {
      window.removeEventListener(type, funcRef.current, options);
    };
  }, []);
}
