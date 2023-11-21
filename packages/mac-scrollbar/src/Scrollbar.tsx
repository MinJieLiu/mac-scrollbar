import React, { useImperativeHandle, useRef } from 'react';
import type { ScrollbarBase } from './types';
import { useScrollbar } from './useScrollbar';
import { scrollTo } from './utils';
import './Scrollbar.less';

export interface ScrollbarProps extends ScrollbarBase {
  innerRef?: React.Ref<HTMLElement | null>;
  Wrapper: React.HTMLFactory<HTMLElement>;
}

export default function ScrollBar({
  className = '',
  onScroll,
  onMouseEnter,
  onMouseLeave,
  innerRef,
  children,
  skin = 'light',
  trackGap,
  trackStyle,
  thumbStyle,
  minThumbSize,
  suppressScrollX,
  suppressScrollY,
  suppressAutoHide,
  Wrapper,
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = useRef<HTMLElement>(null);
  useImperativeHandle(innerRef, () => scrollBoxRef.current);

  const [horizontalBar, verticalBar, layout, updateLayerThrottle, hideScrollbarDelay] =
    useScrollbar(
      scrollBoxRef,
      (scrollOffset, horizontal) => scrollTo(scrollBoxRef.current, scrollOffset, horizontal),
      {
        trackGap,
        trackStyle,
        thumbStyle,
        minThumbSize,
        suppressAutoHide,
      },
    );

  function handleScroll(evt: React.UIEvent<HTMLElement, UIEvent>) {
    if (onScroll) {
      onScroll(evt);
    }
    updateLayerThrottle(evt.target as HTMLElement);
  }

  function handleMouseEnter(evt: React.MouseEvent<HTMLElement>) {
    if (onMouseEnter) {
      onMouseEnter(evt);
    }
    layout();
  }

  function handleMouseLeave(evt: React.MouseEvent<HTMLElement>) {
    if (onMouseLeave) {
      onMouseLeave(evt);
    }
    hideScrollbarDelay();
  }

  return (
    <Wrapper
      className={`ms-container${className && ` ${className}`}`}
      ref={scrollBoxRef}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={`ms-track-box ms-theme-${skin}`}>
        {!suppressScrollX && horizontalBar}
        {!suppressScrollY && verticalBar}
      </div>
      {children}
    </Wrapper>
  );
}
