import React, { useMemo, useRef, useState } from 'react';
import { useDebounceCallback, useEventListener, useResizeObserver } from './hooks';
import {
  computeRatio,
  handleExtractSize,
  updateScrollElementStyle,
  updateScrollPosition,
} from './utils';
import type { ActionPosition, BoxSize } from './types';
import ThumbBar from './ThumbBar';

const initialSize: BoxSize = {
  clientWidth: 0,
  scrollWidth: 0,
  clientHeight: 0,
  scrollHeight: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
};

const initialAction: ActionPosition = {
  isPressX: false,
  isPressY: false,
  lastScrollTop: 0,
  lastScrollLeft: 0,
  pressStartX: 0,
  pressStartY: 0,
};

export interface UseScrollbarParams {
  scrollBox: React.MutableRefObject<HTMLElement | null> | Window;
  minThumbSize?: number;
}

export default function useScrollbar({ scrollBox, minThumbSize }: UseScrollbarParams) {
  const isWindow = scrollBox === window;
  const containerRef = useMemo(() => {
    if (isWindow) {
      return { current: document.documentElement };
    }
    return scrollBox as React.MutableRefObject<HTMLElement | null>;
  }, [isWindow, scrollBox]);

  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = useState<BoxSize>(initialSize);
  const [action, updateAction] = useState<ActionPosition>(initialAction);
  const [barVisible, updateBarVisible] = useState<boolean>(true);

  const delayHideScrollbar = useDebounceCallback(() => updateBarVisible(false), { wait: 1000 });

  const updateLayerThrottle = useDebounceCallback(
    () => {
      updateBarVisible(true);
      delayHideScrollbar();
      updateScrollElementStyle(
        containerRef.current,
        horizontalRef.current,
        verticalRef.current,
        minThumbSize,
      );
    },
    { maxWait: 8, leading: true },
  );

  const { clientWidth, scrollWidth, clientHeight, scrollHeight } = boxSize;

  useEventListener('mousemove', (evt) => {
    if (action.isPressX) {
      const horizontalRatio = computeRatio(scrollWidth, clientWidth, minThumbSize).ratio;
      updateScrollPosition(
        containerRef.current,
        Math.floor(
          (evt.clientX - action.pressStartX) * (1 / horizontalRatio) + action.lastScrollLeft,
        ),
        true,
      );
    }
    if (action.isPressY) {
      const verticalRatio = computeRatio(scrollHeight, clientHeight, minThumbSize).ratio;
      updateScrollPosition(
        containerRef.current,
        Math.floor((evt.clientY - action.pressStartY) * (1 / verticalRatio) + action.lastScrollTop),
      );
    }
  });

  useEventListener('mouseup', () => updateAction(initialAction));

  useResizeObserver(containerRef, updateLayerNow);

  function updateLayerNow() {
    if (containerRef.current) {
      updateBoxSize(handleExtractSize(containerRef.current));
      updateLayerThrottle();
    }
  }

  const horizontalBar = scrollWidth - clientWidth > 0 && (
    <ThumbBar
      visible={barVisible}
      isWindow={isWindow}
      minThumbSize={minThumbSize}
      horizontal
      isPress={action.isPressX}
      trackRef={horizontalRef}
      boxSize={boxSize}
      updateAction={updateAction}
    />
  );

  const verticalBar = scrollHeight - clientHeight > 0 && (
    <ThumbBar
      visible={barVisible}
      isWindow={isWindow}
      minThumbSize={minThumbSize}
      isPress={action.isPressY}
      trackRef={verticalRef}
      boxSize={boxSize}
      updateAction={updateAction}
    />
  );

  return {
    updateLayerThrottle,
    updateLayerNow,
    horizontalBar,
    verticalBar,

    updateBarVisible,
  };
}
