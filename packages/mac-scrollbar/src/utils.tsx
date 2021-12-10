/* eslint-disable no-param-reassign */
import type React from 'react';

export const trackSize = 16;

export function isEnableScrollbar() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  // Windows/Linux
  return navigator.userAgent.includes('Windows NT') || navigator.userAgent.includes('X11;');
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
      typeof item === 'object'
        ? Object.keys(item).reduce((prev, curr) => {
            if (item[curr]) {
              prev.push(curr);
            }
            return prev;
          }, [] as string[])
        : item,
    )
    .join(' ');
}

export function updateElementStyle(element: HTMLElement, obj: Record<string, number>) {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const key in obj) {
    element.style[key] = `${obj[key]}px`;
  }
}

export function computeRatio(scrollSize: number, clientSize: number, minThumbSize: number = 20) {
  const realThumbSize = (clientSize / scrollSize) * clientSize;
  const thumbSize = Math.max(minThumbSize, realThumbSize);
  const remaining = clientSize - thumbSize;
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
  minThumbSize?: number,
) {
  const { ratio } = computeRatio(scrollSize, clientSize, minThumbSize);

  updateElementStyle(thumbElement, {
    [direction]: scrollPosition * ratio,
  });
}
