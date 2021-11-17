import React from 'react';
import { isEnableStyle, isEnableScrollbar } from './utils';
import Scrollbar from './Scrollbar';
import type { ScrollbarBase } from './types';

export interface MacScrollbarProps extends ScrollbarBase {
  /**
   * When set to true, macOS browsers will use native scrollbar.
   */
  suppressMacOS?: boolean;
}

export const MacScrollbar = React.forwardRef<HTMLDivElement, MacScrollbarProps>(
  ({ suppressScrollX, suppressScrollY, suppressMacOS, style, children, ...props }, ref) => {
    const currentStyle = {
      overflowX: isEnableStyle(suppressScrollX),
      overflowY: isEnableStyle(suppressScrollY),
      ...style,
    };

    if (suppressMacOS && !isEnableScrollbar()) {
      return (
        <div style={currentStyle} ref={ref} {...props}>
          {children}
        </div>
      );
    }

    return (
      <Scrollbar
        style={currentStyle}
        innerRef={ref}
        suppressScrollX={suppressScrollX}
        suppressScrollY={suppressScrollY}
        {...props}
      >
        {children}
      </Scrollbar>
    );
  },
);
