import React, { useMemo, useRef, useState } from 'react';
import { useDebounceCallback, useEventListener, useResizeObserver } from './hooks';
import {
  computeRatio,
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
  scrollBox: React.MutableRefObject<HTMLElement | null> | Window;
}

export default function useScrollbar({
  scrollBox,
  trackEndGap = 16,
  trackStyle,
  thumbStyle,
  minThumbSize,
  suppressHideScrollbar,
}: UseScrollbarParams) {
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

  const delayHideScrollbar = useDebounceCallback(() => updateBarVisible(false), { wait: 1000 });

  const { CW, SW, CH, SH } = boxSize;
  const showHorizontalBar = SW - CW > 0;
  const showVerticalBar = SH - CH > 0;
  const gapSize = showHorizontalBar && showVerticalBar ? trackEndGap : 0;

  const updateLayerThrottle = useDebounceCallback(
    () => {
      updateBarVisible(true);
      if (!suppressHideScrollbar) {
        delayHideScrollbar();
      }
      updateScrollElementStyle(
        containerRef.current,
        horizontalRef.current,
        verticalRef.current,
        gapSize,
        minThumbSize,
      );
    },
    { maxWait: 8, leading: true },
  );

  useEventListener('mousemove', (evt) => {
    if (action.pinX) {
      const horizontalRatio = computeRatio(SW, CW, gapSize, minThumbSize).ratio;
      updateScrollPosition(
        containerRef.current,
        Math.floor((evt.clientX - action.startX) * (1 / horizontalRatio) + action.lastSL),
        true,
      );
    }
    if (action.pinY) {
      const verticalRatio = computeRatio(SH, CH, gapSize, minThumbSize).ratio;
      updateScrollPosition(
        containerRef.current,
        Math.floor((evt.clientY - action.startY) * (1 / verticalRatio) + action.lastST),
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

  const horizontalBar = showHorizontalBar && (
    <ThumbBar
      visible={barVisible}
      isGlobal={isGlobal}
      trackStyle={trackStyle}
      thumbStyle={thumbStyle}
      minThumbSize={minThumbSize}
      gapSize={gapSize}
      horizontal
      isPress={action.pinX}
      trackRef={horizontalRef}
      boxSize={boxSize}
      updateAction={updateAction}
    />
  );

  const verticalBar = showVerticalBar && (
    <ThumbBar
      visible={barVisible}
      isGlobal={isGlobal}
      trackStyle={trackStyle}
      thumbStyle={thumbStyle}
      minThumbSize={minThumbSize}
      gapSize={gapSize}
      isPress={action.pinY}
      trackRef={verticalRef}
      boxSize={boxSize}
      updateAction={updateAction}
    />
  );

  return [
    horizontalBar,
    verticalBar,
    updateLayerNow,
    updateLayerThrottle,
    updateBarVisible,
  ] as const;
}
