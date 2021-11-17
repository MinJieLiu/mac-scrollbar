import React from 'react';
import { classNames } from './utils';
import { useSyncRef } from './hooks';
import type { ScrollbarBase } from './types';
import useScrollbar from './useScrollbar';
import './Scrollbar.less';

export interface ScrollbarProps extends ScrollbarBase {
  innerRef?: React.Ref<HTMLDivElement>;
}

export default function ScrollBar({
  className,
  onScroll,
  onMouseEnter,
  onMouseLeave,
  innerRef,
  children,
  suppressScrollX,
  suppressScrollY,
  theme = 'white',
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);
  useSyncRef(innerRef, scrollBoxRef);

  const { updateLayerThrottle, updateLayerNow, horizontalBar, verticalBar, updateBarVisible } =
    useScrollbar(scrollBoxRef);

  function handleScroll(evt: React.UIEvent<HTMLDivElement, UIEvent>) {
    if (onScroll) {
      onScroll(evt);
    }
    updateLayerThrottle();
  }

  function handleMouseEnter(evt: React.MouseEvent<HTMLDivElement>) {
    if (onMouseEnter) {
      onMouseEnter(evt);
    }
    updateLayerNow();
  }

  function handleMouseLeave(evt: React.MouseEvent<HTMLDivElement>) {
    if (onMouseLeave) {
      onMouseLeave(evt);
    }
    updateBarVisible(false);
  }

  return (
    <div
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
    </div>
  );
}
