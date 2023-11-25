/* eslint-disable no-param-reassign */
import type { BoxSize, ScrollPosition, TrackGap } from './types';

export function getGapSize(
  trackGap: number | TrackGap | ((showBarX: boolean, showBarY: boolean) => TrackGap),
  showBarX: boolean,
  showBarY: boolean,
): [startX: number, gapX: number, startY: number, gapY: number] {
  let nextTrackGap = trackGap;
  if (typeof nextTrackGap === 'function') {
    nextTrackGap = nextTrackGap(showBarX, showBarY);
  }
  if (Array.isArray(nextTrackGap)) {
    const [startX, endX, startY, endY] = nextTrackGap;
    return [startX, startX + endX, startY, startY + endY];
  }
  const endGap = showBarX && showBarY ? nextTrackGap : 0;
  return [0, endGap, 0, endGap];
}

export function handleExtractSize(target: HTMLElement) {
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = window.getComputedStyle(target);
  const { clientWidth, scrollWidth, clientHeight, scrollHeight } = target;
  return {
    CW: clientWidth,
    SW: scrollWidth,
    CH: clientHeight,
    SH: scrollHeight,
    PT: parseInt(paddingTop, 10),
    PR: parseInt(paddingRight, 10),
    PB: parseInt(paddingBottom, 10),
    PL: parseInt(paddingLeft, 10),
  };
}

export function isEnableStyle(disabled?: boolean): 'hidden' | 'auto' {
  return disabled ? 'hidden' : 'auto';
}

export function computeRatio(
  scrollSize: number,
  clientSize: number,
  gapSize: number,
  minThumbSize: number = 20,
) {
  const boxSize = clientSize - gapSize;
  const realThumbSize = (boxSize / scrollSize) * boxSize;
  const thumbSize = Math.max(minThumbSize, realThumbSize);
  const remaining = boxSize - thumbSize;
  const distance = scrollSize - clientSize;
  return {
    thumbSize,
    ratio: remaining / distance,
  };
}

export function scrollTo(
  element: HTMLElement | null | undefined,
  position: number,
  horizontal?: boolean,
) {
  if (!element) {
    return;
  }
  if (horizontal) {
    element.scrollLeft = position;
    return;
  }
  element.scrollTop = position;
}

export function updateScrollElementStyle(
  boxSize: BoxSize,
  position: ScrollPosition,
  horizontalElement: HTMLElement | null | undefined,
  verticalElement: HTMLElement | null | undefined,
  gapX: number,
  gapY: number,
  minThumbSize?: number,
) {
  const { SW, SH, CW, CH } = boxSize;
  const { scrollTop, scrollLeft } = position;

  if (horizontalElement) {
    const offsetX = scrollLeft * computeRatio(SW, CW, gapX, minThumbSize).ratio;
    (horizontalElement.firstChild as HTMLDivElement).style.transform = `translateX(${offsetX}px)`;
  }

  if (verticalElement) {
    const offsetY = scrollTop * computeRatio(SH, CH, gapY, minThumbSize).ratio;
    (verticalElement.firstChild as HTMLDivElement).style.transform = `translateY(${offsetY}px)`;
  }
}
