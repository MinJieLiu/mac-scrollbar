/* eslint-disable no-param-reassign */
import type { RefObject, Ref } from 'react';
import { useRef, useEffect, useCallback } from 'react';
import { updateRef } from './utils';

export function useInitial<T extends (...args: any) => any>(callback: T) {
  const { current } = useRef({ initial: false, storeValue: undefined as ReturnType<T> });
  if (!current.initial) {
    current.initial = true;
    current.storeValue = callback();
  }
  return current.storeValue;
}

export function useLatest<T>(something: T) {
  const ref = useRef(something);
  ref.current = something;
  return ref;
}

export function useEventListener<K extends keyof WindowEventMap>(
  type: K | undefined,
  fn: (evt: WindowEventMap[K]) => void,
  options?: AddEventListenerOptions,
) {
  const latest = useLatest(fn);

  useEffect(() => {
    function wrapper(evt: WindowEventMap[K]) {
      latest.current(evt);
    }
    if (type) {
      window.addEventListener(type, wrapper, options);
    }
    return () => {
      if (type) {
        window.removeEventListener(type, wrapper);
      }
    };
  }, [type]);
}

export function useResizeObserver(
  scrollBoxRef: RefObject<HTMLElement | null>,
  callback: () => void,
) {
  const throttleCallback = useDebounceCallback(callback, { maxWait: 8, leading: true });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      throttleCallback();
    });

    if (scrollBoxRef.current) {
      if (scrollBoxRef.current === document.documentElement) {
        resizeObserver.observe(document.body);
      } else {
        resizeObserver.observe(scrollBoxRef.current);
        Array.from(scrollBoxRef.current.children).forEach((child) => {
          resizeObserver.observe(child);
        });
      }
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollBoxRef]);
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
  const prev = useRef(0);
  const trailingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const clearTrailing = () => trailingTimeout.current && clearTimeout(trailingTimeout.current);

  useEffect(
    () => () => {
      prev.current = 0;
      clearTrailing();
    },
    [wait, maxWait, leading],
  );

  return useCallback(
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
  innerRef: Ref<HTMLElement> | undefined,
  scrollBoxRef: RefObject<HTMLElement>,
) {
  useEffect(() => {
    updateRef(innerRef, scrollBoxRef.current);
    return () => {
      updateRef(innerRef, null);
    };
  }, [innerRef, scrollBoxRef]);
}
