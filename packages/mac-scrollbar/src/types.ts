import type React from 'react';

export interface BoxSize {
  // clientWidth
  CW: number;
  // scrollWidth
  SW: number;
  // clientHeight
  CH: number;
  // scrollHeight
  SH: number;
  // paddingTop
  PT: number;
  // paddingRight
  PR: number;
  // paddingBottom
  PB: number;
  // paddingLeft
  PL: number;
}

export interface ActionPosition {
  pinX?: boolean;
  pinY?: boolean;
  // lastScrollTop
  lastST: number;
  // lastScrollLeft
  lastSL: number;
  startX: number;
  startY: number;
}

export interface GlobalScrollbarBase {
  /**
   * Adapt to the background color of the container.
   * @defaultValue 'light'
   */
  skin?: 'light' | 'dark';
  /**
   * Track style.
   */
  trackStyle?: (horizontal?: boolean) => React.CSSProperties;
  /**
   * Thumb bar style.
   */
  thumbStyle?: (horizontal?: boolean) => React.CSSProperties;
  /**
   * Minimum thumb bar size.
   * @defaultValue 20
   */
  minThumbSize?: number;
  /**
   * When set to true, the scrollbar will not be automatically hidden.
   */
  suppressAutoHide?: boolean;
}

export interface ScrollbarBase extends GlobalScrollbarBase, React.HtmlHTMLAttributes<HTMLElement> {
  /**
   * When set to true, the scrollbar in X-axis will not be available, regardless of the content width.
   */
  suppressScrollX?: boolean;
  /**
   * When set to true, the scroll bar in Y-axis will not be available, regardless of the content height.
   */
  suppressScrollY?: boolean;
  /**
   * Gap at the cross end of the scroll bar.
   * @defaultValue 16
   */
  trackGap?: number | [startX: number, endX: number, startY: number, endY: number];
  /**
   * children
   */
  children: React.ReactNode;
}
