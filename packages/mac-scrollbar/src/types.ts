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
  isPressX?: boolean;
  isPressY?: boolean;
  lastScrollTop: number;
  lastScrollLeft: number;
  pressStartX: number;
  pressStartY: number;
}

export interface GlobalScrollbarBase {
  /**
   * Adapt to the background color of the container.
   * @defaultValue 'white'
   */
  skin?: 'white' | 'dark';
  /**
   * Gap at the cross end of the scroll bar.
   * @defaultValue 16
   */
  trackEndGap?: number;
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
  suppressHideScrollbar?: boolean;
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
   * children
   */
  children: React.ReactNode;
}
