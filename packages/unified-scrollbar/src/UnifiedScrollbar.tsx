import React from 'react';
import styles from './UnifiedScrollbar.module.less';

interface UnifiedScrollbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface ScrollSize {
  offsetWidth: number;
  scrollWidth: number;
  scrollLeft: number;
  offsetHeight: number;
  scrollHeight: number;
  scrollTop: number;
}

const initialSize = {
  offsetWidth: 0,
  scrollWidth: 0,
  scrollLeft: 0,
  offsetHeight: 0,
  scrollHeight: 0,
  scrollTop: 0,
};

export default function UnifiedScrollbar({ className, children, ...props }: UnifiedScrollbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = React.useState<ScrollSize>(initialSize);

  React.useEffect(() => {
    setBoxSize(handleExtractSize(ref.current!));
  }, []);

  const handleScroll = useThrottle((evt: React.UIEvent<HTMLDivElement, UIEvent>) => {
    setBoxSize(handleExtractSize(evt.target as HTMLDivElement));
  }, 8);

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

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight, scrollTop } = boxSize;

  return (
    <div className={`${styles.scrollbarBox} ${className}`} {...props}>
      <div className={styles.scrollbarScroll} ref={ref} onScroll={handleScroll}>
        {React.useMemo(() => children, [])}

        {scrollHeight - offsetHeight > 0 && (
          <div className={styles.scrollbar} onClick={handleScrollbarClick}>
            <div
              className={styles.thumb}
              onClick={(e) => e.stopPropagation()}
              style={{
                top: Math.min((scrollTop / scrollHeight) * offsetHeight, offsetHeight - 20),
                height: Math.max((offsetHeight / scrollHeight) * offsetHeight, 20),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function handleExtractSize(target: HTMLDivElement) {
  const { offsetWidth, scrollWidth, scrollLeft, offsetHeight, scrollHeight, scrollTop } = target;
  return {
    offsetWidth,
    scrollWidth,
    scrollLeft,
    offsetHeight,
    scrollHeight,
    scrollTop,
  };
}

function useThrottle<T extends any[]>(func: (...args: T) => void, delay: number) {
  const ref = React.useRef({ last: 0, func });
  ref.current.func = func;

  return React.useCallback((...args: T) => {
    const that = ref.current;
    const now = Date.now();
    if (now > that.last + delay) {
      that.last = now;
      that.func(...args);
    }
  }, []);
}
