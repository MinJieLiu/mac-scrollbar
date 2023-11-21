import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TrackGap, GlobalScrollbarBase } from './types';
import { isEnableScrollbar, scrollTo } from './utils';
import { useEventListener } from './hooks';
import { useScrollbar } from './useScrollbar';

export interface GlobalScrollbarProps extends GlobalScrollbarBase {
  /**
   * Gap at the cross end of the scroll bar.
   * @defaultValue 16
   */
  trackGap?: number | TrackGap | ((showBarX: boolean, showBarY: boolean) => TrackGap);
}

function GlobalScrollbarInject({ skin = 'light', ...props }: GlobalScrollbarProps) {
  const { documentElement, body } = document;

  const scrollRef = useRef(documentElement);

  useEffect(() => {
    const wrapperCls = 'ms-container';
    const docClassList = documentElement.classList;
    docClassList.add(wrapperCls);
    return () => {
      docClassList.remove(wrapperCls);
    };
  }, [skin]);

  const [horizontalBar, verticalBar, layout, updateLayerThrottle] = useScrollbar(
    scrollRef,
    (scrollOffset, horizontal) => scrollTo(documentElement, scrollOffset, horizontal),
    props,
  );

  useEventListener('scroll', () => {
    if (!(horizontalBar || verticalBar)) {
      layout();
      return;
    }
    updateLayerThrottle(documentElement);
  });

  return createPortal(
    <div className={`ms-track-global ms-theme-${skin}`}>
      {horizontalBar}
      {verticalBar}
    </div>,
    body,
  );
}

export function GlobalScrollbar(props: GlobalScrollbarProps) {
  if (!isEnableScrollbar()) {
    return null;
  }
  return <GlobalScrollbarInject {...props} />;
}
