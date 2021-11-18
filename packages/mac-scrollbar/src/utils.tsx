/* eslint-disable no-param-reassign */
import type React from 'react';

export const minThumbSize = 20;

export const thumbBarSize = 16;

export function isEnableScrollbar() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  // Windows/Linux
  return navigator.userAgent.includes('Windows NT') || navigator.userAgent.includes('X11;');
}

export function updateRef(
  innerRef: React.Ref<HTMLDivElement> | undefined,
  scrollBoxElement: HTMLDivElement | null,
) {
  if (!innerRef) {
    return;
  }
  if (typeof innerRef === 'function') {
    innerRef(scrollBoxElement);
    return;
  }
  // @ts-ignore
  (innerRef as React.MutableRefObject<HTMLDivElement>).current = scrollBoxElement;
}

export function handleExtractSize(target: HTMLElement) {
  const { clientWidth, scrollWidth, clientHeight, scrollHeight } = target;
  const { paddingTop, paddingLeft } = window.getComputedStyle(target);
  return {
    clientWidth,
    scrollWidth,
    clientHeight,
    scrollHeight,
    paddingTop: parseInt(paddingTop, 10),
    paddingLeft: parseInt(paddingLeft, 10),
  };
}

export function isEnableStyle(disabled?: boolean) {
  return disabled ? ('hidden' as const) : ('auto' as const);
}

export function classNames(...args: (string | undefined | Record<string, unknown>)[]) {
  return args
    .flatMap((item) =>
      typeof item === 'object' ? Object.keys(item).map((n) => (item[n] ? n : undefined)) : item,
    )
    .join(' ');
}

export function updateElementStyle(element: HTMLElement, obj: Record<string, number>) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in obj) {
    element.style[key] = `${obj[key]}px`;
  }
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
    );
  }

  if (verticalElement) {
    updateThumbStyle(
      verticalElement.firstChild as HTMLDivElement,
      scrollHeight,
      clientHeight,
      scrollTop,
      'top',
    );
  }
}

export function updateThumbStyle(
  thumbElement: HTMLDivElement,
  scrollSize: number,
  offsetSize: number,
  scrollPosition: number,
  direction: 'left' | 'top',
) {
  const realThumbSize = (offsetSize / scrollSize) * offsetSize;
  const distance = Math.max(minThumbSize - realThumbSize, 0);

  updateElementStyle(thumbElement, {
    [direction]: Math.min(
      (scrollPosition / scrollSize) * (offsetSize - distance),
      offsetSize - minThumbSize,
    ),
  });
}
