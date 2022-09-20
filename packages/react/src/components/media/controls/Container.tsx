import { CSS } from '@stitches/react';
import { styling } from 'livepeer';
import * as React from 'react';

import { PropsOf } from '../../system';

export type ContainerProps = PropsOf<'div'> & {
  children: React.ReactNode;
  className?: string;
  css?: CSS;
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children, css, className, ...rest } = props;

    return (
      <div className={className}>
        <div
          className={styling.container({ css })}
          ref={ref}
          tabIndex={0}
          {...rest}
        >
          {children}
        </div>
      </div>
    );
  },
);

Container.displayName = 'Container';
