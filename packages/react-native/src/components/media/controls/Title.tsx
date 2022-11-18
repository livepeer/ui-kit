import * as React from 'react';

import { Title as TitleStyled } from '../../styling';

import { PropsOf } from '../../system';

export type TitleProps = Omit<PropsOf<typeof TitleStyled>, 'children'> & {
  content: React.ReactNode;
};

export const Title = React.forwardRef<typeof TitleStyled, TitleProps>(
  (props, ref) => {
    const { content, ...rest } = props;

    return (
      <TitleStyled ref={ref} {...rest}>
        {content}
      </TitleStyled>
    );
  },
);
