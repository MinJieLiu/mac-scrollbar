import type { CSSProperties, RefObject, MouseEvent, Dispatch, SetStateAction } from 'react';
import React, { memo } from 'react';
import { computeRatio, updateScrollPosition } from './utils';
import type { ActionPosition, BoxSize } from './types';
import './ThumbBar.less';

export interface ThumbBarProps {
  visible: boolean;
  isGlobal: boolean;
  trackStyle?: (horizontal?: boolean) => CSSProperties;
  thumbStyle?: (horizontal?: boolean) => CSSProperties;
  minThumbSize?: number;
  start: number;
  gap: number;
  /**
   * @default vertical
   */
  horizontal?: boolean;
  pin: boolean | undefined;

  trackRef: RefObject<HTMLDivElement>;
  boxSize: BoxSize;

  update: Dispatch<SetStateAction<ActionPosition>>;
}

function ThumbBar({
  visible,
  isGlobal,
  trackStyle,
  thumbStyle,
  minThumbSize,
  start,
  gap,
  horizontal,
  pin,

  trackRef,
  boxSize,

  update,
}: ThumbBarProps) {
  const { CW, CH, PT, PR, PB, PL, SW, SH } = boxSize;

  const [sizeKey, offsetSize, scrollSize] = horizontal ? ['width', CW, SW] : ['height', CH, SH];

  function getContainerBox() {
    const targetNode = trackRef.current?.parentNode?.parentNode as HTMLDivElement | HTMLBodyElement;
    return targetNode === document.body ? document.documentElement : targetNode;
  }

  function handleThumbBarClick(e: MouseEvent<HTMLDivElement>) {
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

  function handleStart(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { scrollLeft, scrollTop } = getContainerBox();
    update({
      pinX: horizontal,
      pinY: !horizontal,
      lastST: scrollTop,
      lastSL: scrollLeft,
      startX: e.clientX,
      startY: e.clientY,
    });
  }

  const style: CSSProperties = {
    ...(isGlobal
      ? { [sizeKey]: gap > 0 ? `calc(100% - ${gap}px)` : undefined }
      : {
          [sizeKey]: offsetSize - gap,
          ...(horizontal
            ? {
                bottom: -PB,
                left: -PL + start,
              }
            : {
                top: PT - gap + start,
                right: -PR,
                transform: 'translateY(-100%)',
              }),
        }),
    ...(trackStyle && trackStyle(horizontal)),
  };

  return (
    <div
      className={`ms-track${horizontal ? ' ms-x' : ' ms-y'}${
        pin ? ' ms-active' : visible ? ' ms-track-show' : ''
      }`}
      onClick={handleThumbBarClick}
      ref={trackRef}
      style={style}
    >
      <div
        className="ms-thumb"
        draggable="true"
        onDragStartCapture={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseDown={handleStart}
        onClick={(e) => e.stopPropagation()}
        style={{
          [sizeKey]: computeRatio(scrollSize, offsetSize, gap, minThumbSize).thumbSize,
          ...(thumbStyle && thumbStyle(horizontal)),
        }}
      />
    </div>
  );
}

export default memo(ThumbBar);
