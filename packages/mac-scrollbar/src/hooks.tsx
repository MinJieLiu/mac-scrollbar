/* eslint-disable no-param-reassign */
import React from 'react';
import { updateRef } from './utils';

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

export function useResizeObserver(
  scrollBoxRef: React.RefObject<HTMLDivElement>,
  children: React.ReactNode,
  callback: () => void,
) {
  const throttleCallback = useThrottleCallback(callback, 32, true);
  const count = React.Children.count(children);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      throttleCallback();
    });

    if (scrollBoxRef.current) {
      Array.from(scrollBoxRef.current.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollBoxRef, count]);
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

export function useSyncRef(
  innerRef: React.Ref<HTMLDivElement> | undefined,
  scrollBoxRef: React.RefObject<HTMLDivElement>,
) {
  React.useEffect(() => {
    updateRef(innerRef, scrollBoxRef.current);
    return () => {
      updateRef(innerRef, null);
    };
  }, [innerRef, scrollBoxRef]);
}
