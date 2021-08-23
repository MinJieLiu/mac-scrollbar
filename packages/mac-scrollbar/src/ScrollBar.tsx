import React from 'react';
import { classNames } from './utils';
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

  onSlotClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onThumbMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
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

  onSlotClick,
  onThumbMouseDown,
}: ScrollBarProps) {
  const positionKey = horizontal ? 'left' : 'top';
  const sizeKey = horizontal ? 'width' : 'height';
  const scrollPosition = horizontal ? scrollLeft : scrollTop;
  const offsetSize = horizontal ? offsetWidth : offsetHeight;

  return (
    <div
      className={classNames(styles.scrollbar, horizontal ? styles.horizontal : styles.vertical, {
        [styles.active]: isPress,
      })}
      onClick={onSlotClick}
      style={
        horizontal
          ? { top: scrollTop + offsetHeight - 16, left: scrollLeft }
          : { top: scrollTop, left: scrollLeft + offsetWidth - 16 }
      }
    >
      <div
        className={styles.thumb}
        onMouseDown={onThumbMouseDown}
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
