import * as React from 'react';

import { AspectRatio, Container as ContainerStyled } from '../../styling';
import { MediaElement } from '../types';

export type ContainerProps = {
  aspectRatio: AspectRatio;
  children: React.ReactNode;
};

export const Container = React.forwardRef<MediaElement, ContainerProps>(
  (props, ref) => {
    const { children, aspectRatio } = props;

    return (
      <ContainerStyled aspectRatio={aspectRatio} ref={ref}>
        {children}
      </ContainerStyled>
    );
  },
);

Container.displayName = 'Container';
