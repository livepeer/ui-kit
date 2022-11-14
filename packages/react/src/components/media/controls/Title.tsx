import { styling } from 'livepeer/media/browser/styling';
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
