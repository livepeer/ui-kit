import { AspectRatio, ThemeConfig } from 'livepeer/media';
import * as React from 'react';

import { Container as ContainerStyled, ThemeProvider } from '../../styling';
import { MediaElement } from '../types';

export type ContainerProps = {
  aspectRatio: AspectRatio;
  children: React.ReactNode;
  theme?: ThemeConfig;
};

export const Container = React.forwardRef<MediaElement, ContainerProps>(
  (props, ref) => {
    const { children, aspectRatio, theme } = props;

    return (
      <ThemeProvider theme={theme}>
        <ContainerStyled aspectRatio={aspectRatio} ref={ref}>
          {children}
        </ContainerStyled>
      </ThemeProvider>
    );
  },
);

Container.displayName = 'Container';
