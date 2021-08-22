import React from 'react';
import { handleExtractSize, useThrottle } from './utils';
import styles from './MacScrollbar.module.less';

export interface MacScrollbarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
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

export default function MacScrollbar({ className, children, ...props }: MacScrollbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [boxSize, setBoxSize] = React.useState<ScrollSize>(initialSize);

  React.useEffect(() => {
    setBoxSize(handleExtractSize(ref.current!));
  }, []);

  const handleScroll = useThrottle(
    (evt: React.UIEvent<HTMLDivElement, UIEvent>) =>
      setBoxSize(handleExtractSize(evt.target as HTMLDivElement)),
    8,
  );

  const { offsetWidth, scrollWidth, offsetHeight, scrollHeight, scrollTop } = boxSize;

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
