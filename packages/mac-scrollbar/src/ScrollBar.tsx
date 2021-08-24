import React from 'react';
import { classNames } from './utils';
import type { ActionPosition } from './types';
import styles from './Scrollbar.module.less';

export interface ScrollBarProps {
  /**
   * @default vertical
   */
  horizontal?: boolean;
  /**
   * @default white
   */
  theme?: 'dark';
  isPress: boolean;

  scrollNode: HTMLDivElement | null;
  scrollSize: number;
  offsetWidth: number;
  offsetHeight: number;

  updateAction: React.Dispatch<React.SetStateAction<ActionPosition>>;
  updatePosition: (position: number, horizontal?: boolean) => void;
}

const minThumbSize = 20;

export default function ScrollBar({
  horizontal,
  isPress,

  scrollNode,
  scrollSize,
  offsetWidth,
  offsetHeight,

  updateAction,
  updatePosition,
}: ScrollBarProps) {
  const [positionKey, sizeKey, offsetSize] = horizontal
    ? ['left', 'width', offsetWidth]
    : ['top', 'height', offsetHeight];

  const slotRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollNode?.addEventListener('scroll', (e) => {
      const { scrollTop, scrollLeft } = e.target as HTMLDivElement;
      const scrollPosition = horizontal ? scrollLeft : scrollTop;

      updateElementStyle(
        slotRef,
        horizontal
          ? {
              bottom: -scrollTop,
              left: scrollLeft,
            }
          : {
              top: scrollTop,
              right: -scrollLeft,
            },
      );

      updateElementStyle(thumbRef, {
        [positionKey]: Math.min(
          (scrollPosition / scrollSize) * offsetSize,
          offsetSize - minThumbSize,
        ),
      });
    });
  }, []);

  function updateElementStyle(ref: React.RefObject<HTMLDivElement>, obj: Record<string, number>) {
    Object.keys(obj).forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      ref.current!.style[item] = `${obj[item]}px`;
    });
  }

  function handleScrollbarClick(e: React.MouseEvent<HTMLDivElement>) {
    const scrollPosition = horizontal ? scrollNode!.scrollLeft : scrollNode!.scrollTop;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickPosition = horizontal
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
    const scrollRatio = scrollPosition / scrollSize;

    const position =
      clickPosition > scrollRatio
        ? Math.min(scrollSize, scrollPosition + offsetSize)
        : Math.max(0, scrollPosition - offsetSize);

    updatePosition(position, horizontal);
  }

  function handleStart(e: React.MouseEvent<HTMLDivElement>) {
    updateAction({
      isPressX: Boolean(horizontal),
      isPressY: !horizontal,
      lastScrollTop: scrollNode!.scrollTop,
      lastScrollLeft: scrollNode!.scrollLeft,
      pressStartX: e.clientX,
      pressStartY: e.clientY,
    });
  }

  return (
    <div
      className={classNames(styles.scrollbar, horizontal ? styles.horizontal : styles.vertical, {
        [styles.active]: isPress,
      })}
      onClick={handleScrollbarClick}
      ref={slotRef}
    >
      <div
        className={styles.thumb}
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [sizeKey]: Math.max((offsetSize / scrollSize) * offsetSize, minThumbSize),
        }}
        ref={thumbRef}
      />
    </div>
  );
}
