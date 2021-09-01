import React from 'react';
import { isDirectionEnable, isEnableScrollbar } from './utils';
import Scrollbar from './Scrollbar';
import type { ScrollbarPropsBase } from './types';

export interface MacScrollbarProps extends ScrollbarPropsBase {
  /**
   * @defaultValue 'auto'
   */
  enable?: 'auto' | 'all';
}

export const MacScrollbar = React.forwardRef<HTMLDivElement, MacScrollbarProps>(
  ({ direction = 'auto', enable = 'auto', style, children, ...props }, ref) => {
    const currentStyle = {
      overflowX: isDirectionEnable(direction, 'horizontal'),
      overflowY: isDirectionEnable(direction, 'vertical'),
      ...style,
    };

    if (enable === 'auto' && !isEnableScrollbar()) {
      return (
        <div style={currentStyle} ref={ref} {...props}>
          {children}
        </div>
      );
    }

    return (
      <Scrollbar direction={direction} style={currentStyle} innerRef={ref} {...props}>
        {children}
      </Scrollbar>
    );
  },
);
