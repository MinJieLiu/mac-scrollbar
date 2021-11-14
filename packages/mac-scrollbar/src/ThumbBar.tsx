import React from 'react';
import { classNames, minThumbSize, thumbBarSize, updateScrollPosition } from './utils';
import type { ActionPosition, BoxSize } from './types';
import './ThumbBar.less';

export interface ThumbBarProps {
  visible: boolean;
  /**
   * @default vertical
   */
  horizontal?: boolean;
  /**
   * @default white
   */
  theme?: 'dark';
  isPress: boolean | undefined;

  grooveRef: React.RefObject<HTMLDivElement>;
  boxSize: BoxSize;

  updateAction: React.Dispatch<React.SetStateAction<ActionPosition>>;
}

function ThumbBar({
  visible,
  horizontal,
  isPress,

  grooveRef,
  boxSize,

  updateAction,
}: ThumbBarProps) {
  const { offsetWidth, offsetHeight, paddingTop, paddingLeft, scrollWidth, scrollHeight } = boxSize;

  const [sizeKey, offsetSize, scrollSize] = horizontal
    ? ['width', offsetWidth, scrollWidth]
    : ['height', offsetHeight, scrollHeight];

  function handleThumbBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const scrollNode = grooveRef.current?.parentNode?.parentNode as HTMLDivElement;
    const { scrollLeft, scrollTop } = scrollNode;
    const scrollPosition = horizontal ? scrollLeft : scrollTop;
    const rect = (e.target as HTMLDivElement).getBoundingClientRect();
    const clickPosition = horizontal
      ? (e.clientX - rect.left) / rect.width
      : (e.clientY - rect.top) / rect.height;
    const scrollRatio = scrollPosition / scrollSize;

    const position =
      clickPosition > scrollRatio
        ? Math.min(scrollSize, scrollPosition + offsetSize)
        : Math.max(0, scrollPosition - offsetSize);

    updateScrollPosition(scrollNode, position, horizontal);
  }

  function handleStart(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const trackBox = grooveRef.current?.parentNode as HTMLDivElement;
    const { scrollLeft, scrollTop } = trackBox?.parentNode as HTMLDivElement;
    updateAction({
      isPressX: horizontal,
      isPressY: !horizontal,
      lastScrollTop: scrollTop,
      lastScrollLeft: scrollLeft,
      pressStartX: e.clientX,
      pressStartY: e.clientY,
    });
  }

  return (
    <div
      className={classNames('ms-track', horizontal ? 'ms-x' : 'ms-y', {
        'ms-active': isPress,
        'ms-track-show': visible,
      })}
      onClick={handleThumbBarClick}
      ref={grooveRef}
      style={{
        [sizeKey]: offsetSize,
        top: (horizontal ? offsetHeight - thumbBarSize : 0) - paddingTop,
        left: (horizontal ? 0 : offsetWidth - thumbBarSize) - paddingLeft,
      }}
    >
      <div
        className="ms-thumb"
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [sizeKey]: Math.max((offsetSize / scrollSize) * offsetSize, minThumbSize),
        }}
      />
    </div>
  );
}

export default React.memo(ThumbBar);
