import React, { useCallback, useRef, useState } from 'react';
import { useDebounceCallback, useEventListener, useObserverListening } from './hooks';
import type { ScrollPosition, ScrollbarProps, ActionPosition, BoxSize } from './types';
import { computeRatio, getGapSize, handleExtractSize, updateScrollElementStyle } from './utils';
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

export function useScrollbar(
  scrollRef: React.MutableRefObject<HTMLElement | null>,
  onScroll: (scrollOffset: number, horizontal?: boolean) => void,
  {
    skin = 'light',
    trackGap = 16,
    trackStyle,
    thumbStyle,
    minThumbSize,
    suppressAutoHide,
    suppressScrollX,
    suppressScrollY,
  }: ScrollbarProps = {},
) {
  const horizontalRef = useRef<HTMLDivElement>(null);
  const verticalRef = useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = useState<BoxSize>(initialSize);
  const [action, updateAction] = useState<ActionPosition>(initialAction);
  const [barVisible, updateBarVisible] = useState<boolean>(true);

  const hideScrollbarDelay = useDebounceCallback(
    () => !suppressAutoHide && updateBarVisible(false),
    { wait: 1000 },
  );

  const { CW, SW, CH, SH } = boxSize;
  const showBarX = SW - CW > 0;
  const showBarY = SH - CH > 0;
  const [startX, gapX, startY, gapY] = getGapSize(trackGap, showBarX, showBarY);

  const moveTo = useDebounceCallback(
    (position: ScrollPosition) => {
      updateBarVisible(true);
      hideScrollbarDelay();
      updateScrollElementStyle(
        boxSize,
        position,
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
        onScroll(
          Math.floor((evt.clientX - action.startX) * (1 / horizontalRatio) + action.lastSL),
          true,
        );
      }
      if (action.pinY) {
        const verticalRatio = computeRatio(SH, CH, gapY, minThumbSize).ratio;
        onScroll(Math.floor((evt.clientY - action.startY) * (1 / verticalRatio) + action.lastST));
      }
    },
    undefined,
    { capture: true },
  );

  useEventListener('mouseup', () => updateAction(initialAction));

  const layout = useCallback(() => {
    if (scrollRef.current) {
      updateBoxSize(handleExtractSize(scrollRef.current));
      moveTo(scrollRef.current);
    }
  }, []);

  useEventListener('mouseenter', layout, () => scrollRef.current);
  useEventListener('mouseleave', hideScrollbarDelay, () => scrollRef.current);

  useObserverListening(scrollRef, layout);

  const horizontalBar = showBarX && (
    <ThumbBar
      scrollRef={scrollRef}
      visible={barVisible}
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

  const verticalBar = showBarY && (
    <ThumbBar
      scrollRef={scrollRef}
      visible={barVisible}
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

  const scrollbarNode = (
    <div className={`ms-track-box ms-theme-${skin}`}>
      {!suppressScrollX && horizontalBar}
      {!suppressScrollY && verticalBar}
    </div>
  );

  return [scrollbarNode, moveTo, layout] as const;
}
