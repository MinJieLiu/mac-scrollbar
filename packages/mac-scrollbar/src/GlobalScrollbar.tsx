import React from 'react';
import { createPortal } from 'react-dom';
import { isEnableScrollbar } from './utils';
import { useEventListener, useInitial } from './hooks';
import type { GlobalScrollbarBase } from './types';
import useScrollbar from './useScrollbar';

export interface GlobalScrollbarProps extends GlobalScrollbarBase {
  /**
   * When set to true, macOS browsers will use native scrollbar.
   */
  suppressMacOS?: boolean;
}

function GlobalScrollbarInject({ theme = 'white' }: GlobalScrollbarBase) {
  const wrapper = useInitial(() => document.createElement('div'));

  React.useEffect(() => {
    wrapper.classList.add('ms-track-box', `ms-theme-${theme}`);
    document.body.prepend(wrapper);
    return () => {
      document.body.removeChild(wrapper);
    };
  }, [wrapper, theme]);

  const { updateLayerThrottle, horizontalBar, verticalBar } = useScrollbar({
    current: document.documentElement,
  });

  useEventListener('scroll', updateLayerThrottle);

  return createPortal(
    <>
      {horizontalBar}
      {verticalBar}
    </>,
    wrapper,
  );
}

export function GlobalScrollbar({ suppressMacOS, ...props }: GlobalScrollbarProps) {
  if (suppressMacOS && !isEnableScrollbar()) {
    return null;
  }
  return <GlobalScrollbarInject {...props} />;
}
