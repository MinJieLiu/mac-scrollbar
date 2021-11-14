import React from 'react';
import {
  classNames,
  handleExtractSize,
  updateScrollElementStyle,
  updateScrollPosition,
} from './utils';
import { useEventListener, useResizeObserver, useSyncRef, useDebounceCallback } from './hooks';
import type { ActionPosition, ScrollbarPropsBase, BoxSize } from './types';
import ThumbBar from './ThumbBar';
import './Scrollbar.less';

export interface ScrollbarProps extends ScrollbarPropsBase {
  innerRef?: React.Ref<HTMLDivElement>;
}

const initialSize: BoxSize = {
  offsetWidth: 0,
  scrollWidth: 0,
  offsetHeight: 0,
  scrollHeight: 0,
  paddingTop: 0,
  paddingLeft: 0,
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
  theme = 'white',
  ...props
}: ScrollbarProps) {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);
  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const verticalRef = React.useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = React.useState<BoxSize>(initialSize);
  const [action, updateAction] = React.useState<ActionPosition>(initialAction);
  const [barVisible, updateBarVisible] = React.useState<boolean>(true);

  useSyncRef(innerRef, scrollBoxRef);

  const delayHideScrollbar = useDebounceCallback(() => updateBarVisible(false), { wait: 3000 });

  const updateLayerThrottle = useDebounceCallback(
    () => {
      updateBarVisible(true);
      delayHideScrollbar();
      updateScrollElementStyle(scrollBoxRef.current, horizontalRef.current, verticalRef.current);
    },
    { maxWait: 8, leading: true },
  );

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;

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
      <div className={classNames('ms-track-box', `ms-theme-${theme}`)}>
        {!suppressScrollX && scrollWidth - offsetWidth > 0 && (
          <ThumbBar
            visible={barVisible}
            horizontal
            isPress={action.isPressX}
            grooveRef={horizontalRef}
            boxSize={boxSize}
            updateAction={updateAction}
          />
        )}
        {!suppressScrollY && scrollHeight - offsetHeight > 0 && (
          <ThumbBar
            visible={barVisible}
            isPress={action.isPressY}
            grooveRef={verticalRef}
            boxSize={boxSize}
            updateAction={updateAction}
          />
        )}
      </div>
      {children}
    </div>
  );
}
