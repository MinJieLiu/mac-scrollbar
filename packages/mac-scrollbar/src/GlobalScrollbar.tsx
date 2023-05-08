import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { isEnableScrollbar } from './utils';
import { useEventListener, useInitial } from './hooks';
import type { GlobalScrollbarBase } from './types';
import useScrollbar from './useScrollbar';

export interface GlobalScrollbarProps extends GlobalScrollbarBase {
  /**
   * Gap at the cross end of the scroll bar.
   * @defaultValue 16
   */
  trackGap?: number | [startX: number, endX: number, startY: number, endY: number];
}

function GlobalScrollbarInject({ skin = 'light', ...props }: GlobalScrollbarProps) {
  const wrapper = useInitial(() => document.createElement('div'));

  useEffect(() => {
    wrapper.classList.add('ms-track-global', `ms-theme-${skin}`);
    wrapper.classList.remove(`ms-theme-${skin === 'light' ? 'dark' : 'light'}`);
    const wrapperCls = 'ms-container';
    const docClassList = document.documentElement.classList;

    docClassList.add(wrapperCls);
    document.body.append(wrapper);
    return () => {
      docClassList.remove(wrapperCls);
      document.body.removeChild(wrapper);
    };
  }, [wrapper, skin]);

  const [horizontalBar, verticalBar, updateLayerNow, updateLayerThrottle] = useScrollbar(
    window,
    props,
  );

  useEventListener('scroll', () => {
    if (!(horizontalBar || verticalBar)) {
      updateLayerNow();
      return;
    }
    updateLayerThrottle();
  });

  return createPortal(
    <>
      {horizontalBar}
      {verticalBar}
    </>,
    wrapper,
  );
}

export function GlobalScrollbar(props: GlobalScrollbarProps) {
  if (!isEnableScrollbar()) {
    return null;
  }
  return <GlobalScrollbarInject {...props} />;
}
