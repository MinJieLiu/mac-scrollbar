/* eslint-disable no-param-reassign */
import React from 'react';
import { updateRef } from './utils';

export function useLatest<T>(something: T) {
  const ref = React.useRef(something);
  ref.current = something;
  return ref;
}

export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  fn: (evt: WindowEventMap[K]) => void,
) {
  const latest = useLatest(fn);

  React.useEffect(() => {
    function wrapper(evt: WindowEventMap[K]) {
      latest.current(evt);
    }
    window.addEventListener(type, wrapper);

    return () => {
      window.removeEventListener(type, wrapper);
    };
  }, [type, latest]);
}

export function useResizeObserver(
  scrollBoxRef: React.RefObject<HTMLDivElement>,
  children: React.ReactNode,
  callback: () => void,
) {
  const throttleCallback = useDebounceCallback(callback, { maxWait: 32, leading: true });
  const count = React.Children.count(children);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      throttleCallback();
    });

    if (scrollBoxRef.current) {
      resizeObserver.observe(scrollBoxRef.current);
      Array.from(scrollBoxRef.current.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollBoxRef, count]);
}

export function useDebounceCallback<CallbackArguments extends any[]>(
  callback: (...args: CallbackArguments) => void,
  {
    leading = false,
    maxWait,
    wait = maxWait || 0,
  }: {
    leading?: boolean;
    maxWait?: number;
    wait?: number;
  },
): (...args: CallbackArguments) => void {
  const callbackRef = useLatest(callback);
  const prev = React.useRef(0);
  const trailingTimeout = React.useRef<ReturnType<typeof setTimeout>>();
  const clearTrailing = () => trailingTimeout.current && clearTimeout(trailingTimeout.current);

  React.useEffect(
    () => () => {
      prev.current = 0;
      clearTrailing();
    },
    [wait, maxWait, leading],
  );

  return React.useCallback(
    (...args) => {
      const now = Date.now();

      function call() {
        prev.current = now;
        clearTrailing();
        callbackRef.current.apply(null, args);
      }
      const last = prev.current;
      const offset = now - last;
      // leading
      if (last === 0) {
        if (leading) {
          call();
          return;
        }
        prev.current = now;
      }

      // body
      if (maxWait !== undefined) {
        if (offset > maxWait) {
          call();
          return;
        }
      } else if (offset < wait) {
        prev.current = now;
      }

      // trailing
      clearTrailing();
      trailingTimeout.current = setTimeout(() => {
        call();
        prev.current = 0;
      }, wait);
    },
    [wait, maxWait, leading],
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
