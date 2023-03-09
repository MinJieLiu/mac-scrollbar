import React, { useMemo, useRef, useState } from 'react';
import { useDebounceCallback, useEventListener, useResizeObserver } from './hooks';
import {
  computeRatio,
  getGapSize,
  handleExtractSize,
  updateScrollElementStyle,
  updateScrollPosition,
} from './utils';
import type { GlobalScrollbarBase } from './types';
import type { ActionPosition, BoxSize } from './types';
import ThumbBar from './ThumbBar';

const initialSize: BoxSize = {
  CW: 0,
  SW: 0,
  CH: 0,
  SH: 0,
  PT: 0,
  PR: 0,
  PB: 0,
  PL: 0,
};

const initialAction: ActionPosition = {
  pinX: false,
  pinY: false,
  lastST: 0,
  lastSL: 0,
  startX: 0,
  startY: 0,
};

export interface UseScrollbarParams extends GlobalScrollbarBase {
  trackGap?: number | [startX: number, endX: number, startY: number, endY: number];
}

export default function useScrollbar(
  scrollBox: React.MutableRefObject<HTMLElement | null> | Window,
  { trackGap = 16, trackStyle, thumbStyle, minThumbSize, suppressAutoHide }: UseScrollbarParams,
) {
  const isGlobal = scrollBox === window;
  const containerRef = useMemo(() => {
    if (isGlobal) {
      return { current: document.documentElement };
    }
    return scrollBox as React.MutableRefObject<HTMLElement | null>;
  }, [isGlobal, scrollBox]);

  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = useState<BoxSize>(initialSize);
  const [action, updateAction] = useState<ActionPosition>(initialAction);
  const [barVisible, updateBarVisible] = useState<boolean>(true);

  const hideScrollbar = () => !suppressAutoHide && updateBarVisible(false);
  const delayHideScrollbar = useDebounceCallback(hideScrollbar, { wait: 1000 });

  const { CW, SW, CH, SH } = boxSize;
  const showHorizontalBar = SW - CW > 0;
  const showVerticalBar = SH - CH > 0;
  const [startX, gapX, startY, gapY] = getGapSize(trackGap, showHorizontalBar && showVerticalBar);

  const updateLayerThrottle = useDebounceCallback(
    () => {
      updateBarVisible(true);
      delayHideScrollbar();
      updateScrollElementStyle(
        containerRef.current,
        horizontalRef.current,
        verticalRef.current,
        gapX,
        gapY,
        minThumbSize,
      );
    },
    { maxWait: 8, leading: true },
  );

  useEventListener(
    'mousemove',
    (evt) => {
      if (action.pinX) {
        const horizontalRatio = computeRatio(SW, CW, gapX, minThumbSize).ratio;
        updateScrollPosition(
          containerRef.current,
          Math.floor((evt.clientX - action.startX) * (1 / horizontalRatio) + action.lastSL),
          true,
        );
      }
      if (action.pinY) {
        const verticalRatio = computeRatio(SH, CH, gapY, minThumbSize).ratio;
        updateScrollPosition(
          containerRef.current,
          Math.floor((evt.clientY - action.startY) * (1 / verticalRatio) + action.lastST),
        );
      }
    },
    { capture: true },
  );

  useEventListener('mouseup', () => updateAction(initialAction));

  useResizeObserver(containerRef, updateLayerNow);

  function updateLayerNow() {
    if (containerRef.current) {
      updateBoxSize(handleExtractSize(containerRef.current));
      updateLayerThrottle();
    }
  }

  const horizontalBar = showHorizontalBar && (
    <ThumbBar
      visible={barVisible}
      isGlobal={isGlobal}
      trackStyle={trackStyle}
      thumbStyle={thumbStyle}
      minThumbSize={minThumbSize}
      start={startX}
      gap={gapX}
      horizontal
      pin={action.pinX}
      trackRef={horizontalRef}
      boxSize={boxSize}
      update={updateAction}
    />
  );

  const verticalBar = showVerticalBar && (
    <ThumbBar
      visible={barVisible}
      isGlobal={isGlobal}
      trackStyle={trackStyle}
      thumbStyle={thumbStyle}
      minThumbSize={minThumbSize}
      start={startY}
      gap={gapY}
      pin={action.pinY}
      trackRef={verticalRef}
      boxSize={boxSize}
      update={updateAction}
    />
  );

  return [horizontalBar, verticalBar, updateLayerNow, updateLayerThrottle, hideScrollbar] as const;
}
