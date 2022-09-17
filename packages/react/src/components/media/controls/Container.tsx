import { styled } from '@stitches/react';
import { playerCss } from 'livepeer';
import * as React from 'react';

import { PropsOf } from '../../system';

const StyledContainer = styled('div', playerCss.videoPlayerContainer);

export type ContainerProps = PropsOf<typeof StyledContainer>;

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children, ...rest } = props;

    return (
      <StyledContainer ref={ref} tabIndex={0} {...rest}>
        {children}
      </StyledContainer>
    );
  },
);

Container.displayName = 'Container';
