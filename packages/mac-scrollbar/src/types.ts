import type React from 'react';

export interface BoxSize {
  offsetWidth: number;
  scrollWidth: number;
  offsetHeight: number;
  scrollHeight: number;
  paddingTop: number;
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

export interface ScrollbarPropsBase extends React.HtmlHTMLAttributes<HTMLDivElement> {
  /**
   * When set to true, the scrollbar in X-axis will not be available, regardless of the content width.
   */
  suppressScrollX?: boolean;
  /**
   * When set to true, the scroll bar in Y-axis will not be available, regardless of the content height.
   */
  suppressScrollY?: boolean;
  /**
   * Adapt to the background color of the container.
   * @default 'white'
   */
  theme?: 'white' | 'dark';
  children: React.ReactNode;
}
