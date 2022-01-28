import type React from 'react';

export interface BoxSize {
  clientWidth: number;
  scrollWidth: number;
  clientHeight: number;
  scrollHeight: number;
  paddingTop: number;
  paddingRight: number;
  paddingBottom: number;
  paddingLeft: number;
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
   * Minimum thumb bar size.
   * @defaultValue 20
   */
  minThumbSize?: number;
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
