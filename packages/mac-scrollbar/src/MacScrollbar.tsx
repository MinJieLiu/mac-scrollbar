import React from 'react';
import { classNames, handleExtractSize } from './utils';
import { useThrottle, useEventListener } from './hooks';
import ScrollBar from './ScrollBar';
import styles from './MacScrollbar.module.less';

export interface MacScrollbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  /**
   * @default auto
   */
  direction?: 'vertical' | 'horizontal' | 'auto';
  children: React.ReactNode;
}

interface ScrollSize {
  offsetWidth: number;
  scrollWidth: number;
  offsetHeight: number;
  scrollHeight: number;
}

interface ActionPosition {
  isPress: boolean;
  lastScrollTop: number;
  lastScrollLeft: number;
  pressStartX: number;
  pressStartY: number;
}

const initialSize: ScrollSize = {
  offsetWidth: 0,
  scrollWidth: 0,
  offsetHeight: 0,
  scrollHeight: 0,
};

const initialAction: ActionPosition = {
  isPress: false,
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
  const [boxSize, setBoxSize] = React.useState<ScrollSize>(initialSize);
  const [action, setAction] = React.useState<ActionPosition>(initialAction);

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;
  const { scrollTop, scrollLeft } = ref.current || { scrollTop: 0, scrollLeft: 0 };
  const verticalRatio = scrollHeight / offsetHeight;

  useEventListener('mousemove', (evt) => {
    if (action.isPress) {
      ref.current!.scrollTop = Math.floor(
        (evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop,
      );
    }
  });

  useEventListener('mouseup', () => setAction(initialAction));

  React.useEffect(() => {
    setBoxSize(handleExtractSize(ref.current!));
  }, []);

  const handleScroll = useThrottle(
    (evt: React.UIEvent<HTMLDivElement, UIEvent>) =>
      setBoxSize(handleExtractSize(evt.target as HTMLDivElement)),
    8,
  );

  function handleScrollbarClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickPosition = (e.clientY - rect.top) / rect.height;
    const scrollPosition = scrollTop / scrollHeight;

    setBoxSize((state) => {
      const nextScrollTop =
        clickPosition > scrollPosition
          ? Math.min(state.scrollHeight, scrollTop + state.offsetHeight)
          : Math.max(0, scrollTop - state.offsetHeight);
      ref.current!.scrollTop = nextScrollTop;
      return {
        ...state,
        scrollTop: nextScrollTop,
      };
    });
  }

  function handleStart(e: React.MouseEvent<HTMLDivElement>) {
    setAction({
      isPress: true,
      lastScrollTop: scrollTop,
      lastScrollLeft: scrollLeft,
      pressStartX: e.clientX,
      pressStartY: e.clientY,
    });
  }

  return (
    <div
      className={classNames(styles.scrollbarBox, className)}
      style={{
        overflowX: direction === 'auto' || direction === 'horizontal' ? 'auto' : undefined,
        overflowY: direction === 'auto' || direction === 'vertical' ? 'auto' : undefined,
      }}
      ref={ref}
      onScroll={handleScroll}
      {...props}
    >
      {React.useMemo(() => children, [])}

      {scrollWidth - offsetWidth > 0 && (
        <ScrollBar
          horizontal
          isPress={action.isPress}
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          scrollSize={scrollWidth}
          offsetWidth={offsetWidth}
          offsetHeight={offsetHeight}
          onSlotClick={handleScrollbarClick}
          onThumbMouseDown={handleStart}
        />
      )}
      {scrollHeight - offsetHeight > 0 && (
        <ScrollBar
          isPress={action.isPress}
          scrollTop={scrollTop}
          scrollLeft={scrollLeft}
          scrollSize={scrollHeight}
          offsetWidth={offsetWidth}
          offsetHeight={offsetHeight}
          onSlotClick={handleScrollbarClick}
          onThumbMouseDown={handleStart}
        />
      )}
    </div>
  );
}
