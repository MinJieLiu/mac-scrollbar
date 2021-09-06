import React from 'react';
import {
  classNames,
  handleExtractSize,
  updateScrollElementStyle,
  updateScrollPosition,
} from './utils';
import { useEventListener, useResizeObserver, useSyncRef, useThrottleCallback } from './hooks';
import type { ActionPosition, ScrollbarPropsBase, ScrollSize } from './types';
import ThumbBar from './ThumbBar';
import './Scrollbar.less';

export interface ScrollbarProps extends ScrollbarPropsBase {
  innerRef?: React.Ref<HTMLDivElement>;
}

const initialSize: ScrollSize = {
  offsetWidth: 0,
  scrollWidth: 0,
  offsetHeight: 0,
  scrollHeight: 0,
};

const initialAction: ActionPosition = {
  isPressX: false,
  isPressY: false,
  lastScrollTop: 0,
  lastScrollLeft: 0,
  pressStartX: 0,
  pressStartY: 0,
};

export default function ScrollBar({
  className,
  onScroll,
  onMouseEnter,
  innerRef,
  children,
  suppressScrollX,
  suppressScrollY,
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);
  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const verticalRef = React.useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = React.useState<ScrollSize>(initialSize);
  const [action, updateAction] = React.useState<ActionPosition>(initialAction);

  useSyncRef(innerRef, scrollBoxRef);

  const updateLayerThrottle = useThrottleCallback(
    () => {
      updateScrollElementStyle(scrollBoxRef.current, horizontalRef.current, verticalRef.current);
    },
    8,
    true,
  );

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = scrollBoxRef.current || boxSize;

  useEventListener('mousemove', (evt) => {
    if (action.isPressX) {
      const horizontalRatio = scrollWidth / offsetWidth;
      updateScrollPosition(
        scrollBoxRef.current,
        Math.floor((evt.clientX - action.pressStartX) * horizontalRatio + action.lastScrollLeft),
        true,
      );
    }
    if (action.isPressY) {
      const verticalRatio = scrollHeight / offsetHeight;
      updateScrollPosition(
        scrollBoxRef.current,
        Math.floor((evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop),
      );
    }
  });

  useEventListener('mouseup', () => updateAction(initialAction));

  useResizeObserver(scrollBoxRef, children, handleUpdateLayer);

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
    handleUpdateLayer();
  }

  function handleUpdateLayer() {
    if (scrollBoxRef.current) {
      updateBoxSize(handleExtractSize(scrollBoxRef.current));
      updateLayerThrottle();
    }
  }

  return (
    <div
      className={classNames('ms-container', className)}
      ref={scrollBoxRef}
      onScroll={handleScroll}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      <div className="ms-scrollWrapper">
        {!suppressScrollX && scrollWidth - offsetWidth > 0 && (
          <ThumbBar
            horizontal
            isPress={action.isPressX}
            grooveRef={horizontalRef}
            scrollSize={scrollWidth}
            offsetWidth={offsetWidth}
            offsetHeight={offsetHeight}
            updateAction={updateAction}
          />
        )}
        {!suppressScrollY && scrollHeight - offsetHeight > 0 && (
          <ThumbBar
            isPress={action.isPressY}
            grooveRef={verticalRef}
            scrollSize={scrollHeight}
            offsetWidth={offsetWidth}
            offsetHeight={offsetHeight}
            updateAction={updateAction}
          />
        )}
      </div>
      {children}
    </div>
  );
}
