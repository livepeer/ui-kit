import { ContainerProps } from '@livepeer/core-react/components';
import * as React from 'react';

import { useTheme } from '../../../context';

import { Container as ContainerStyled, ThemeProvider } from '../../styling';

export type { ContainerProps };

export const Container: React.FC<ContainerProps> = (props) => {
  const { children, aspectRatio, theme } = props;

  const contextTheme = useTheme(theme);

  return (
    <ThemeProvider theme={contextTheme}>
      <ContainerStyled aspectRatio={aspectRatio}>{children}</ContainerStyled>
    </ThemeProvider>
  );
};
