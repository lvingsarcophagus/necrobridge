'use client';

import React from 'react';


export interface MenuToggleIconProps extends React.ComponentProps<'svg'> {
  open?: boolean;
  duration?: number;
}

export const MenuToggleIcon = React.forwardRef<SVGSVGElement, MenuToggleIconProps>(
  ({ open = false, duration = 500, className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transition: `transform ${duration}ms ease-out`,
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}
        {...props}
      >
        {open ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </>
        )}
      </svg>
    );
  }
);

MenuToggleIcon.displayName = 'MenuToggleIcon';
