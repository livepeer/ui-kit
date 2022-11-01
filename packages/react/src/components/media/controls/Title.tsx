'use client'; // client component browser directive (React RFC-0227)

import { styling } from 'livepeer/styling';
import * as React from 'react';

import { PropsOf } from '../../system';

export type TitleProps = Omit<PropsOf<'span'>, 'children'> & {
  content: React.ReactNode;
};

export const Title = React.forwardRef<HTMLSpanElement, TitleProps>(
  (props, ref) => {
    const { content, ...rest } = props;

    return (
      <span
        className={styling.title()}
        aria-label={'Title'}
        ref={ref}
        {...rest}
      >
        {content}
      </span>
    );
  },
);
