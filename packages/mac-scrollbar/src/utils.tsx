/* eslint-disable no-param-reassign */
import type React from 'react';

export function isEnableScrollbar() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  const { userAgent } = navigator;
  // Windows/Linux
  return userAgent.includes('Windows NT') || userAgent.includes('X11;');
}

export function updateRef(
  innerRef: React.Ref<HTMLElement> | undefined,
  scrollBoxElement: HTMLElement | null,
) {
  if (!innerRef) {
    return;
  }
  if (typeof innerRef === 'function') {
    innerRef(scrollBoxElement);
    return;
  }
  // @ts-ignore
  (innerRef as React.MutableRefObject<HTMLElement>).current = scrollBoxElement;
}

export function handleExtractSize(target: HTMLElement) {
  const { clientWidth, scrollWidth, clientHeight, scrollHeight } = target;
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = window.getComputedStyle(target);
  return {
    clientWidth,
    scrollWidth,
    clientHeight,
    scrollHeight,
    paddingTop: parseInt(paddingTop, 10),
    paddingRight: parseInt(paddingRight, 10),
    paddingBottom: parseInt(paddingBottom, 10),
    paddingLeft: parseInt(paddingLeft, 10),
  };
}

export function isEnableStyle(disabled?: boolean) {
  return disabled ? ('hidden' as const) : ('auto' as const);
}

export function updateElementStyle(element: HTMLElement, obj: Record<string, number>) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in obj) {
    element.style[key] = `${obj[key]}px`;
  }
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

export function updateScrollPosition(
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
  containerElement: HTMLElement | null | undefined,
  horizontalElement: HTMLElement | null | undefined,
  verticalElement: HTMLElement | null | undefined,
  emptySize: number,
  minThumbSize?: number,
) {
  if (!containerElement) {
    return;
  }
  const { scrollTop, scrollLeft, scrollWidth, scrollHeight, clientWidth, clientHeight } =
    containerElement;

  if (horizontalElement) {
    updateThumbStyle(
      horizontalElement.firstChild as HTMLDivElement,
      scrollWidth,
      clientWidth,
      scrollLeft,
      'left',
      emptySize,
      minThumbSize,
    );
  }

  if (verticalElement) {
    updateThumbStyle(
      verticalElement.firstChild as HTMLDivElement,
      scrollHeight,
      clientHeight,
      scrollTop,
      'top',
      emptySize,
      minThumbSize,
    );
  }
}

export function updateThumbStyle(
  thumbElement: HTMLDivElement,
  scrollSize: number,
  clientSize: number,
  scrollPosition: number,
  direction: 'left' | 'top',
  emptySize: number,
  minThumbSize?: number,
) {
  const { ratio } = computeRatio(scrollSize, clientSize, emptySize, minThumbSize);

  updateElementStyle(thumbElement, {
    [direction]: scrollPosition * ratio,
  });
}
