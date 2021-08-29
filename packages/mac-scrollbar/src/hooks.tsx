import React from 'react';

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  fn: (evt: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  const funcRef = React.useRef(fn);
  funcRef.current = fn;

  React.useEffect(() => {
    function wrapper(evt: WindowEventMap[K]) {
      funcRef.current(evt);
    }
    window.addEventListener(type, wrapper, options);

    return () => {
      window.removeEventListener(type, wrapper, options);
    };
  }, []);
}

export function useThrottleCallback<CallbackArguments extends any[]>(
  callback: (...args: CallbackArguments) => void,
  ms: number,
  leading = false,
): (...args: CallbackArguments) => void {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;
  const prev = React.useRef(0);
  const trailingTimeout = React.useRef<ReturnType<typeof setTimeout>>();
  const clearTrailing = () => trailingTimeout.current && clearTimeout(trailingTimeout.current);

  React.useEffect(
    () => () => {
      prev.current = 0;
      clearTrailing();
    },
    [ms, leading],
  );

  return React.useCallback(
    (...args) => {
      const now = Date.now();
      const call = () => {
        prev.current = now;
        clearTrailing();
        callbackRef.current.apply(null, args);
      };
      const { current } = prev;
      // leading
      if (leading && current === 0) {
        call();
        return;
      }
      // body
      if (now - current > ms) {
        if (current > 0) {
          call();
          return;
        }
        prev.current = now;
      }
      // trailing
      clearTrailing();
      trailingTimeout.current = setTimeout(() => {
        call();
        prev.current = 0;
      }, ms);
    },
    [ms, leading],
  );
}

export function useThrottle<State>(
  initialState: State | (() => State),
  ms: number,
  leading?: boolean,
): [State, React.Dispatch<React.SetStateAction<State>>] {
  const state = React.useState<State>(initialState);
  return [state[0], useThrottleCallback(state[1], ms, leading)];
}
