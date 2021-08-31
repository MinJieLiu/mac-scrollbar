import React from 'react';
import { classNames, isDirectionEnable, isEnableScrollbar } from './utils';
import Scrollbar from './Scrollbar';
import type { MacScrollbarProps } from './types';

export const MacScrollbar = React.forwardRef<HTMLDivElement, MacScrollbarProps>(
  ({ direction = 'auto', className, style, children, ...props }, ref) => {
    const currentStyle = {
      overflowX: isDirectionEnable(direction, 'horizontal'),
      overflowY: isDirectionEnable(direction, 'vertical'),
      ...style,
    };

    if (!isEnableScrollbar()) {
      return (
        <div
          className={classNames('ms-container', className)}
          style={currentStyle}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <Scrollbar
        direction={direction}
        className={className}
        style={currentStyle}
        innerRef={ref}
        {...props}
      >
        {children}
      </Scrollbar>
    );
  },
);
