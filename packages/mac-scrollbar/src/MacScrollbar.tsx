import React from 'react';
import { handleExtractSize, useThrottle } from './utils';
import styles from './MacScrollbar.module.less';

export interface MacScrollbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
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

export default function MacScrollbar({ className = '', children, ...props }: MacScrollbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = React.useState<ScrollSize>(initialSize);
  const [action, setAction] = React.useState<ActionPosition>(initialAction);

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight } = boxSize;
  const { scrollTop, scrollLeft } = ref.current || { scrollTop: 0, scrollLeft: 0 };
  const verticalRatio = scrollHeight / offsetHeight;

  const handleDrag = useThrottle((evt: MouseEvent) => {
    if (action.isPress) {
      ref.current!.scrollTop = Math.floor(
        (evt.clientY - action.pressStartY) * verticalRatio + action.lastScrollTop,
      );
    }
  }, 8);

  React.useEffect(() => {
    setBoxSize(handleExtractSize(ref.current!));

    function handleUp() {
      setAction(initialAction);
    }
    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleUp);
    };
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
    // eslint-disable-next-line no-console
    console.log(offsetWidth, scrollWidth);

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
      className={`${styles.scrollbarBox} ${className}`}
      ref={ref}
      onScroll={handleScroll}
      {...props}
    >
      {React.useMemo(() => children, [])}

      {scrollHeight - offsetHeight > 0 && (
        <div
          className={[styles.scrollbar, action.isPress ? styles.active : undefined].join(' ')}
          onClick={handleScrollbarClick}
          style={{ top: scrollTop }}
        >
          <div
            className={styles.thumb}
            onMouseDown={handleStart}
            onClick={(e) => e.stopPropagation()}
            style={{
              top: Math.min((scrollTop / scrollHeight) * offsetHeight, offsetHeight - 20),
              height: Math.max((offsetHeight / scrollHeight) * offsetHeight, 20),
            }}
          />
        </div>
      )}
    </div>
  );
}
