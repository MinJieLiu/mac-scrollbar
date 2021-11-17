import React from 'react';
import { useDebounceCallback, useEventListener, useResizeObserver } from './hooks';
import { handleExtractSize, updateScrollElementStyle, updateScrollPosition } from './utils';
import type { ActionPosition, BoxSize } from './types';
import ThumbBar from './ThumbBar';

const initialSize: BoxSize = {
  offsetWidth: 0,
  scrollWidth: 0,
  offsetHeight: 0,
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

export default function useScrollbar(scrollBoxElement: React.MutableRefObject<HTMLElement | null>) {
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
      updateScrollElementStyle(
        scrollBoxElement.current,
        horizontalRef.current,
        verticalRef.current,
      );
    },
    { maxWait: 8, leading: true },
  );

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;

  useEventListener('mousemove', (evt) => {
    if (action.isPressX) {
      const horizontalRatio = scrollWidth / offsetWidth;
      updateScrollPosition(
        scrollBoxElement.current,
        Math.floor((evt.clientX - action.pressStartX) * horizontalRatio + action.lastScrollLeft),
        true,
      );
    }
    if (action.isPressY) {
      const verticalRatio = scrollHeight / offsetHeight;
      updateScrollPosition(
        scrollBoxElement.current,
        Math.floor((evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop),
      );
    }
  });

  useEventListener('mouseup', () => updateAction(initialAction));

  useResizeObserver(scrollBoxElement, updateLayerNow);

  function updateLayerNow() {
    if (scrollBoxElement.current) {
      updateBoxSize(handleExtractSize(scrollBoxElement.current));
      updateLayerThrottle();
    }
  }

  const horizontalBar = scrollWidth - offsetWidth > 0 && (
    <ThumbBar
      visible={barVisible}
      horizontal
      isPress={action.isPressX}
      grooveRef={horizontalRef}
      boxSize={boxSize}
      updateAction={updateAction}
    />
  );

  const verticalBar = scrollHeight - offsetHeight > 0 && (
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
