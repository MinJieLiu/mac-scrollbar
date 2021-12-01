import React from 'react';
import { isEnableStyle, isEnableScrollbar } from './utils';
import Scrollbar from './Scrollbar';
import type { ScrollbarBase } from './types';

export interface MacScrollbarProps extends ScrollbarBase {
  /**
   * When set to true, macOS browsers will use native scrollbar.
   */
  suppressMacOS?: boolean;
  /**
   * Custom element type.
   * @defaultValue 'div'
   */
  as?: keyof JSX.IntrinsicElements | string;
}

export const MacScrollbar = React.forwardRef<HTMLElement, MacScrollbarProps>(
  (
    { suppressScrollX, suppressScrollY, suppressMacOS, as = 'div', style, children, ...props },
    ref,
  ) => {
    const currentStyle = {
      overflowX: isEnableStyle(suppressScrollX),
      overflowY: isEnableStyle(suppressScrollY),
      ...style,
    };
    const Wrapper = as as unknown as React.HTMLFactory<HTMLElement>;

    if (suppressMacOS && !isEnableScrollbar()) {
      return (
        <Wrapper style={currentStyle} ref={ref} {...props}>
          {children}
        </Wrapper>
      );
    }

    return (
      <Scrollbar
        style={currentStyle}
        innerRef={ref}
        suppressScrollX={suppressScrollX}
        suppressScrollY={suppressScrollY}
        Wrapper={Wrapper}
        {...props}
      >
        {children}
      </Scrollbar>
    );
  },
);
