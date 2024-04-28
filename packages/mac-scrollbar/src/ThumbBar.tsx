import type { CSSProperties, RefObject, MouseEvent, Dispatch, SetStateAction } from 'react';
import React, { useState } from 'react';
import { computeRatio } from './utils';
import type { ActionPosition, BoxSize } from './types';
import './ThumbBar.less';

export interface ThumbBarProps {
  scrollRef: React.MutableRefObject<HTMLElement | null>;
  visible: boolean;
  trackStyle?: (horizontal?: boolean) => CSSProperties;
  thumbStyle?: (horizontal?: boolean) => CSSProperties;
  minThumbSize?: number;
  start: number;
  gap: number;
  horizontal?: boolean;
  pin: boolean | undefined;
  trackRef: RefObject<HTMLDivElement>;
  boxSize: BoxSize;
  update: Dispatch<SetStateAction<ActionPosition>>;
  onScroll: (scrollOffset: number, horizontal?: boolean) => void;
}

export default function ThumbBar({
  scrollRef,
  visible,
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
  onScroll,
}: ThumbBarProps) {
  const [hover, setHover] = useState(false);
  const { CW, CH, PT, PR, PB, PL, SW, SH } = boxSize;

  const [sizeKey, offsetSize, scrollSize] = horizontal ? ['width', CW, SW] : ['height', CH, SH];

  function handleThumbBarClick(e: MouseEvent<HTMLDivElement>) {
    const containerBox = scrollRef.current!;
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

    onScroll(position, horizontal);
  }

  function handleStart(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    const { scrollLeft, scrollTop } = scrollRef.current!;
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
    ...(typeof document !== undefined && scrollRef.current === document.documentElement
      ? { [sizeKey]: gap > 0 ? `calc(100% - ${gap}px)` : undefined }
      : {
          [sizeKey]: offsetSize - gap,
          ...(horizontal
            ? { bottom: -PB, left: -PL + start }
            : { top: PT - gap + start, right: -PR, transform: 'translateY(-100%)' }),
        }),
    ...(trackStyle && trackStyle(horizontal)),
  };

  return (
    <div
      className={`ms-track${horizontal ? ' ms-x' : ' ms-y'}${
        pin ? ' ms-active' : (visible || hover) ? ' ms-track-show' : ''
      }`}
      onClick={handleThumbBarClick}
      onMouseEnter={() => {
        if (visible) {
          setHover(true);
        }
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      ref={trackRef}
      style={style}
    >
      <div
        className="ms-thumb"
        draggable
        onDragStartCapture={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
