import React from 'react';
import { classNames, handleExtractSize } from './utils';
import { useThrottle, useEventListener } from './hooks';
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
  const ref = React.useRef<HTMLDivElement>(null);
  const [boxSize, updateBoxSize] = React.useState<ScrollSize>(initialSize);
  const [action, updateAction] = React.useState<ActionPosition>(initialAction);

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;
  const { scrollTop, scrollLeft } = ref.current || { scrollTop: 0, scrollLeft: 0 };
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
    updateBoxSize(handleExtractSize(ref.current!));
  }, []);

  const handleScroll = useThrottle(
    (evt: React.UIEvent<HTMLDivElement, UIEvent>) =>
      updateBoxSize(handleExtractSize(evt.target as HTMLDivElement)),
    8,
  );

  function updatePosition(position: number, horizontal?: boolean) {
    if (horizontal) {
      ref.current!.scrollLeft = position;
      return;
    }
    ref.current!.scrollTop = position;
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
      ref={ref}
      onScroll={handleScroll}
      {...props}
    >
      {React.useMemo(() => children, [])}

      {scrollWidth - offsetWidth > 0 && (
        <ScrollBar
          horizontal
          isPress={action.isPressX}
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          scrollSize={scrollWidth}
          offsetWidth={offsetWidth}
          offsetHeight={offsetHeight}
          updateAction={updateAction}
          updatePosition={updatePosition}
        />
      )}
      {scrollHeight - offsetHeight > 0 && (
        <ScrollBar
          isPress={action.isPressY}
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          scrollSize={scrollHeight}
          offsetWidth={offsetWidth}
          offsetHeight={offsetHeight}
          updateAction={updateAction}
          updatePosition={updatePosition}
        />
      )}
    </div>
  );
}
