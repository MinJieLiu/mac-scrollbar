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

  scrollTop: number;
  scrollLeft: number;
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

  scrollTop,
  scrollLeft,
  scrollSize,
  offsetWidth,
  offsetHeight,

  updateAction,
  updatePosition,
}: ScrollBarProps) {
  const [positionKey, sizeKey, scrollPosition, offsetSize] = horizontal
    ? ['left', 'width', scrollLeft, offsetWidth]
    : ['top', 'height', scrollTop, offsetHeight];

  function handleScrollbarClick(e: React.MouseEvent<HTMLDivElement>) {
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
      lastScrollTop: scrollTop,
      lastScrollLeft: scrollLeft,
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
      style={
        horizontal
          ? { bottom: -scrollTop, left: scrollLeft }
          : { top: scrollTop, right: -scrollLeft }
      }
    >
      <div
        className={styles.thumb}
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [positionKey]: Math.min(
            (scrollPosition / scrollSize) * offsetSize,
            offsetSize - minThumbSize,
          ),
          [sizeKey]: Math.max((offsetSize / scrollSize) * offsetSize, minThumbSize),
        }}
      />
    </div>
  );
}
