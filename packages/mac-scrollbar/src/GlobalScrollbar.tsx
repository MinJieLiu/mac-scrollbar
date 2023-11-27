import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { ScrollbarProps } from './types';
import { scrollTo } from './utils';
import { useEventListener } from './hooks';
import { useScrollbar } from './useScrollbar';

function GlobalScrollbarInject(props: ScrollbarProps) {
  const scrollRef = useRef(document.documentElement);

  const [scrollbarNode, moveTo] = useScrollbar(
    scrollRef,
    (scrollOffset, horizontal) => scrollTo(scrollRef.current, scrollOffset, horizontal),
    props,
  );
  useEventListener('scroll', () => moveTo(scrollRef.current));

  return createPortal(scrollbarNode, document.body);
}

export function GlobalScrollbar(props: ScrollbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const wrapperCls = 'ms-global';
    const { classList } = document.body;
    classList.add(wrapperCls);
    return () => {
      setMounted(false);

      classList.remove(wrapperCls);
    };
  }, []);

  return mounted && <GlobalScrollbarInject {...props} />;
}
