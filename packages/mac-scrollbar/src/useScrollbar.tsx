import React from 'react';
import { useDebounceCallback, useEventListener, useResizeObserver } from './hooks';
import { handleExtractSize, updateScrollElementStyle, updateScrollPosition } from './utils';
import type { ActionPosition, BoxSize } from './types';
import ThumbBar from './ThumbBar';

const initialSize: BoxSize = {
  clientWidth: 0,
  scrollWidth: 0,
  clientHeight: 0,
  scrollHeight: 0,
  paddingTop: 0,
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

export default function useScrollbar(
  scrollBoxElement: React.MutableRefObject<HTMLElement | null> | Window,
) {
  const containerRef = React.useMemo(() => {
    if (scrollBoxElement === window) {
      return { current: document.documentElement };
    }
    return scrollBoxElement as React.MutableRefObject<HTMLElement | null>;
  }, [scrollBoxElement]);

  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const verticalRef = React.useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = React.useState<BoxSize>(initialSize);
  const [action, updateAction] = React.useState<ActionPosition>(initialAction);
  const [barVisible, updateBarVisible] = React.useState<boolean>(true);

  const delayHideScrollbar = useDebounceCallback(() => updateBarVisible(false), { wait: 1000 });

  const updateLayerThrottle = useDebounceCallback(
    () => {
      updateBarVisible(true);
      delayHideScrollbar();
      updateScrollElementStyle(containerRef.current, horizontalRef.current, verticalRef.current);
    },
    { maxWait: 8, leading: true },
  );

  const { clientWidth, scrollWidth, clientHeight, scrollHeight } = boxSize;

  useEventListener('mousemove', (evt) => {
    if (action.isPressX) {
      const horizontalRatio = scrollWidth / clientWidth;
      updateScrollPosition(
        containerRef.current,
        Math.floor((evt.clientX - action.pressStartX) * horizontalRatio + action.lastScrollLeft),
        true,
      );
    }
    if (action.isPressY) {
      const verticalRatio = scrollHeight / clientHeight;
      updateScrollPosition(
        containerRef.current,
        Math.floor((evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop),
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
      horizontal
      isPress={action.isPressX}
      grooveRef={horizontalRef}
      boxSize={boxSize}
      updateAction={updateAction}
    />
  );

  const verticalBar = scrollHeight - clientHeight > 0 && (
    <ThumbBar
      visible={barVisible}
      isPress={action.isPressY}
      grooveRef={verticalRef}
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
