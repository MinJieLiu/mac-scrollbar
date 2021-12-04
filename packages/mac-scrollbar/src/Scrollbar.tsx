import React from 'react';
import { classNames } from './utils';
import { useSyncRef } from './hooks';
import type { ScrollbarBase } from './types';
import useScrollbar from './useScrollbar';
import './Scrollbar.less';

export interface ScrollbarProps extends ScrollbarBase {
  innerRef?: React.Ref<HTMLElement>;
  Wrapper: React.HTMLFactory<HTMLElement>;
}

export default function ScrollBar({
  className,
  onScroll,
  onMouseEnter,
  onMouseLeave,
  innerRef,
  children,
  minThumbSize,
  suppressScrollX,
  suppressScrollY,
  theme = 'white',
  Wrapper,
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = React.useRef<HTMLElement>(null);
  useSyncRef(innerRef, scrollBoxRef);

  const { updateLayerThrottle, updateLayerNow, horizontalBar, verticalBar, updateBarVisible } =
    useScrollbar({ scrollBox: scrollBoxRef, minThumbSize });

  function handleScroll(evt: React.UIEvent<HTMLElement, UIEvent>) {
    if (onScroll) {
      onScroll(evt);
    }
    updateLayerThrottle();
  }

  function handleMouseEnter(evt: React.MouseEvent<HTMLElement>) {
    if (onMouseEnter) {
      onMouseEnter(evt);
    }
    updateLayerNow();
  }

  function handleMouseLeave(evt: React.MouseEvent<HTMLElement>) {
    if (onMouseLeave) {
      onMouseLeave(evt);
    }
    updateBarVisible(false);
  }

  return (
    <Wrapper
      className={classNames('ms-container', className)}
      ref={scrollBoxRef}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className={classNames('ms-track-box', `ms-theme-${theme}`)}>
        {!suppressScrollX && horizontalBar}
        {!suppressScrollY && verticalBar}
      </div>
      {children}
    </Wrapper>
  );
}
