import React from 'react';
import {
  classNames,
  handleExtractSize,
  isDirectionEnable,
  isEnableScrollbar,
  updateScrollElementStyle,
  updateScrollPosition,
} from './utils';
import { useEventListener, useThrottleCallback } from './hooks';
import ScrollBar from './ScrollBar';
import type { ActionPosition, ScrollSize } from './types';
import './MacScrollbar.less';

export interface MacScrollbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  /**
   * @default auto
   */
  direction?: 'vertical' | 'horizontal' | 'auto';
  innerRef?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
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

function MacScrollbarBase({
  direction,
  className,
  onScroll,
  innerRef,
  children,
  ...props
}: MacScrollbarProps) {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);
  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const verticalRef = React.useRef<HTMLDivElement>(null);
  const macScrollBarRef = innerRef || scrollBoxRef;

  const [boxSize, updateBoxSizeThrottle] = React.useState<ScrollSize>(initialSize);
  const [action, updateAction] = React.useState<ActionPosition>(initialAction);

  const updateLayerThrottle = useThrottleCallback(
    () => {
      updateBoxSizeThrottle(handleExtractSize(macScrollBarRef.current!));
      updateScrollElementStyle(macScrollBarRef.current, horizontalRef.current, verticalRef.current);
    },
    32,
    true,
  );

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;

  useEventListener('mousemove', (evt) => {
    if (action.isPressX) {
      const horizontalRatio = scrollWidth / offsetWidth;
      updateScrollPosition(
        macScrollBarRef.current,
        Math.floor((evt.clientX - action.pressStartX) * horizontalRatio + action.lastScrollLeft),
        true,
      );
    }
    if (action.isPressY) {
      const verticalRatio = scrollHeight / offsetHeight;
      updateScrollPosition(
        macScrollBarRef.current,
        Math.floor((evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop),
      );
    }
  });

  useEventListener('mouseup', () => updateAction(initialAction));

  useEventListener('resize', () => updateLayerThrottle());

  React.useEffect(() => {
    updateLayerThrottle();
  }, []);

  function handleScroll(evt: React.UIEvent<HTMLDivElement, UIEvent>) {
    if (onScroll) {
      onScroll(evt);
    }
    updateScrollElementStyle(macScrollBarRef.current, horizontalRef.current, verticalRef.current);
  }

  return (
    <div
      className={classNames('ms-container', 'ms-prevent', className)}
      ref={macScrollBarRef}
      onScroll={handleScroll}
      {...props}
    >
      {children}

      {scrollWidth - offsetWidth > 0 && (
        <ScrollBar
          horizontal
          isPress={action.isPressX}
          grooveRef={horizontalRef}
          scrollSize={scrollWidth}
          offsetWidth={offsetWidth}
          offsetHeight={offsetHeight}
          updateAction={updateAction}
        />
      )}
      {scrollHeight - offsetHeight > 0 && (
        <ScrollBar
          isPress={action.isPressY}
          grooveRef={verticalRef}
          scrollSize={scrollHeight}
          offsetWidth={offsetWidth}
          offsetHeight={offsetHeight}
          updateAction={updateAction}
        />
      )}
    </div>
  );
}

export function MacScrollbar({
  direction = 'auto',
  className,
  style,
  innerRef,
  children,
  ...props
}: MacScrollbarProps) {
  const currentStyle = {
    overflowX: isDirectionEnable(direction, 'horizontal'),
    overflowY: isDirectionEnable(direction, 'vertical'),
    ...style,
  };

  if (!isEnableScrollbar()) {
    return (
      <div
        className={classNames('ms-container', className)}
        style={currentStyle}
        ref={innerRef}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <MacScrollbarBase
      direction={direction}
      className={className}
      style={currentStyle}
      innerRef={innerRef}
      {...props}
    >
      {children}
    </MacScrollbarBase>
  );
}
