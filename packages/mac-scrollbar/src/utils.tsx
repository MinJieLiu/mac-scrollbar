export function isEnableScrollbar() {
  return typeof navigator !== 'undefined';
}

export function getGapSize(
  trackGap: number | [startX: number, endX: number, startY: number, endY: number],
  showBothBar: boolean,
): [startX: number, gapX: number, startY: number, gapY: number] {
  if (Array.isArray(trackGap)) {
    const [startX, endX, startY, endY] = trackGap;
    return [startX, startX + endX, startY, startY + endY];
  }
  const endGap = showBothBar ? trackGap : 0;
  return [0, endGap, 0, endGap];
}

export function handleExtractSize(target: HTMLElement) {
  const { clientWidth, scrollWidth, clientHeight, scrollHeight } = target;
  const { paddingTop, paddingRight, paddingBottom, paddingLeft } = window.getComputedStyle(target);
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
  gapX: number,
  gapY: number,
  minThumbSize?: number,
) {
  if (!containerElement) {
    return;
  }
  const { scrollTop, scrollLeft, scrollWidth, scrollHeight, clientWidth, clientHeight } =
    containerElement;

  if (horizontalElement) {
    updateElementStyle(horizontalElement.firstChild as HTMLDivElement, {
      left: scrollLeft * computeRatio(scrollWidth, clientWidth, gapX, minThumbSize).ratio,
    });
  }

  if (verticalElement) {
    updateElementStyle(verticalElement.firstChild as HTMLDivElement, {
      top: scrollTop * computeRatio(scrollHeight, clientHeight, gapY, minThumbSize).ratio,
    });
  }
}
