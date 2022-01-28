import React from 'react';
import { computeRatio, updateScrollPosition } from './utils';
import type { ActionPosition, BoxSize } from './types';
import './ThumbBar.less';

export interface ThumbBarProps {
  visible: boolean;
  isGlobal: boolean;
  minThumbSize?: number;
  gapSize: number;
  /**
   * @default vertical
   */
  horizontal?: boolean;
  isPress: boolean | undefined;

  trackRef: React.RefObject<HTMLDivElement>;
  boxSize: BoxSize;

  updateAction: React.Dispatch<React.SetStateAction<ActionPosition>>;
}

function ThumbBar({
  visible,
  isGlobal,
  minThumbSize,
  gapSize,
  horizontal,
  isPress,

  trackRef,
  boxSize,

  updateAction,
}: ThumbBarProps) {
  const {
    clientWidth,
    clientHeight,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    scrollWidth,
    scrollHeight,
  } = boxSize;

  const [sizeKey, offsetSize, scrollSize] = horizontal
    ? ['width', clientWidth, scrollWidth]
    : ['height', clientHeight, scrollHeight];

  function getContainerBox() {
    const targetNode = trackRef.current?.parentNode?.parentNode as HTMLDivElement | HTMLBodyElement;
    return targetNode === document.body ? document.documentElement : targetNode;
  }

  function handleThumbBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const containerBox = getContainerBox();
    const { scrollLeft, scrollTop } = containerBox;
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

    updateScrollPosition(containerBox, position, horizontal);
  }

  function handleStart(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { scrollLeft, scrollTop } = getContainerBox();
    updateAction({
      isPressX: horizontal,
      isPressY: !horizontal,
      lastScrollTop: scrollTop,
      lastScrollLeft: scrollLeft,
      pressStartX: e.clientX,
      pressStartY: e.clientY,
    });
  }

  const style: React.CSSProperties = isGlobal
    ? { position: 'fixed' }
    : {
        [sizeKey]: offsetSize - gapSize,
        ...(horizontal
          ? {
              bottom: -paddingBottom,
              left: -paddingLeft,
            }
          : {
              top: paddingTop - gapSize,
              right: -paddingRight,
              transform: 'translateY(-100%)',
            }),
      };

  return (
    <div
      className={`ms-track ${horizontal ? 'ms-x' : 'ms-y'} ${
        isPress ? 'ms-active' : visible ? 'ms-track-show' : ''
      }`}
      onClick={handleThumbBarClick}
      ref={trackRef}
      style={style}
    >
      <div
        className="ms-thumb"
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [sizeKey]: computeRatio(scrollSize, offsetSize, gapSize, minThumbSize).thumbSize,
        }}
      />
    </div>
  );
}

export default React.memo(ThumbBar);
