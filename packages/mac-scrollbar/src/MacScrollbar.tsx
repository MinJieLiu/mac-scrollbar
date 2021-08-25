import React from 'react';
import { classNames, handleExtractSize, minThumbSize } from './utils';
import { useEventListener } from './hooks';
import ScrollBar from './ScrollBar';
import type { ActionPosition, ScrollSize } from './types';
import styles from './MacScrollbar.module.less';

export interface MacScrollbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  /**
   * @default auto
   */
  direction?: 'vertical' | 'horizontal' | 'auto';
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

export default function MacScrollbar({
  direction = 'auto',
  className = '',
  style,
  children,
  ...props
}: MacScrollbarProps) {
  const scrollBoxRef = React.useRef<HTMLDivElement>(null);
  const horizontalRef = React.useRef<HTMLDivElement>(null);
  const verticalRef = React.useRef<HTMLDivElement>(null);

  const [boxSize, updateBoxSize] = React.useState<ScrollSize>(initialSize);
  const [action, updateAction] = React.useState<ActionPosition>(initialAction);

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;
  const horizontalRatio = scrollWidth / offsetWidth;
  const verticalRatio = scrollHeight / offsetHeight;

  useEventListener('mousemove', (evt) => {
    if (action.isPressX) {
      updatePosition(
        Math.floor((evt.clientX - action.pressStartX) * horizontalRatio + action.lastScrollLeft),
        true,
      );
    }
    if (action.isPressY) {
      updatePosition(
        Math.floor((evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop),
      );
    }
  });

  useEventListener('mouseup', () => updateAction(initialAction));

  React.useEffect(() => {
    updateBoxSize(handleExtractSize(scrollBoxRef.current!));
  }, []);

  function handleScroll(evt: React.UIEvent<HTMLDivElement, UIEvent>) {
    const { scrollTop, scrollLeft } = evt.target as HTMLDivElement;

    if (horizontalRef.current) {
      updateElementStyle(horizontalRef.current, {
        bottom: -scrollTop,
        left: scrollLeft,
      });
      updateThumbStyle(horizontalRef.current.firstChild as HTMLDivElement, scrollLeft, true);
    }

    if (verticalRef.current) {
      updateElementStyle(verticalRef.current, {
        top: scrollTop,
        right: -scrollLeft,
      });
      updateThumbStyle(verticalRef.current.firstChild as HTMLDivElement, scrollTop);
    }
  }

  function updateElementStyle(element: HTMLDivElement, obj: Record<string, number>) {
    Object.keys(obj).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      element.style[item] = `${obj[item]}px`;
    });
  }

  function updateThumbStyle(
    thumbElement: HTMLDivElement,
    scrollPosition: number,
    horizontal?: boolean,
  ) {
    const [positionKey, scrollSize, offsetSize] = horizontal
      ? ['left', scrollWidth, offsetWidth]
      : ['top', scrollHeight, offsetHeight];
    updateElementStyle(thumbElement, {
      [positionKey]: Math.min(
        (scrollPosition / scrollSize) * offsetSize,
        offsetSize - minThumbSize,
      ),
    });
  }

  function updatePosition(position: number, horizontal?: boolean) {
    if (horizontal) {
      scrollBoxRef.current!.scrollLeft = position;
      return;
    }
    scrollBoxRef.current!.scrollTop = position;
  }

  function isDirectionEnable(curr: 'vertical' | 'horizontal' | 'auto') {
    return direction === 'auto' || curr === 'horizontal' ? 'auto' : undefined;
  }

  return (
    <div
      className={classNames(styles.scrollbarBox, className)}
      style={{
        overflowX: isDirectionEnable('horizontal'),
        overflowY: isDirectionEnable('vertical'),
      }}
      ref={scrollBoxRef}
      onScroll={handleScroll}
      {...props}
    >
      {React.useMemo(() => children, [])}

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
