import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ScrollbarProps } from './types';
import { scrollTo } from './utils';
import { useEventListener } from './hooks';
import { useScrollbar } from './useScrollbar';

function GlobalScrollbarInject(props: ScrollbarProps) {
  const { documentElement, body } = document;

  const scrollRef = useRef(documentElement);

  useEffect(() => {
    const wrapperCls = 'ms-global';
    const docClassList = body.classList;
    docClassList.add(wrapperCls);
    return () => {
      docClassList.remove(wrapperCls);
    };
  }, []);

  const [scrollbarNode, moveTo] = useScrollbar(
    scrollRef,
    (scrollOffset, horizontal) => scrollTo(documentElement, scrollOffset, horizontal),
    props,
  );

  useEventListener('scroll', () => moveTo(documentElement));

  return createPortal(scrollbarNode, body);
}

export function GlobalScrollbar(props: ScrollbarProps) {
  if (typeof navigator === 'undefined') {
    return null;
  }
  return <GlobalScrollbarInject {...props} />;
}
