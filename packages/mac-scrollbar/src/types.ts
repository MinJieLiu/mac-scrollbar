import type React from 'react';

export interface ScrollSize {
  offsetWidth: number;
  scrollWidth: number;
  offsetHeight: number;
  scrollHeight: number;
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
   * @default auto
   */
  direction?: 'vertical' | 'horizontal' | 'auto';
  children: React.ReactNode;
}
