import type { RefObject } from 'react';
import { useRef, useEffect, useCallback } from 'react';

export function useLatest<T>(something: T) {
  const ref = useRef(something);
  ref.current = something;
  return ref;
}

export function useEventListener<K extends keyof HTMLElementEventMap>(
  type: K,
  fn: (evt: HTMLElementEventMap[K]) => void,
  getContainer?: () => HTMLElement | null,
  options?: AddEventListenerOptions,
) {
  const latest = useLatest(fn);

  useEffect(() => {
    function wrapper(evt: HTMLElementEventMap[K]) {
      latest.current(evt);
    }
    const container = getContainer ? getContainer() : (window as unknown as HTMLElement);
    if (container) container.addEventListener(type, wrapper, options);
    return () => {
      if (container) container.removeEventListener(type, wrapper);
    };
  }, []);
}

export function useObserverListening(
  scrollBoxRef: RefObject<HTMLElement | null>,
  callback: () => void,
) {
  const throttleCallback = useDebounceCallback(callback, { maxWait: 8, leading: true });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      throttleCallback();
    });
    const mutationObserver = new MutationObserver(() => {
      handleObserve();
    });

    function handleObserve() {
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
    }
    if (scrollBoxRef.current) {
      mutationObserver.observe(scrollBoxRef.current, { childList: true });
    }
    handleObserve();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
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
