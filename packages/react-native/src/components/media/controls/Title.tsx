import { TitleProps } from '@livepeer/core-react/components';
import * as React from 'react';

import { Title as TitleStyled } from '../../styling';

export type { TitleProps };

export const Title: React.FC<TitleProps> = (props) => {
  const { content } = props;

  return <TitleStyled accessibilityLabel="Title">{content}</TitleStyled>;
};
