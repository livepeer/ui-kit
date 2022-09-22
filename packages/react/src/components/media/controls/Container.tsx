import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { PropsOf } from '../../system';
import { useMediaController } from '../context';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export type ContainerProps = PropsOf<'div'> & {
  children: React.ReactNode;
  className?: string;
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children, className, ...rest } = props;

    const { fullscreen } = useMediaController(mediaControllerSelector);

    return (
      <span className={className}>
        <div
          className={styling.container({
            size: fullscreen ? 'fullscreen' : 'default',
          })}
          ref={ref}
          tabIndex={0}
          {...rest}
        >
          {children}
        </div>
      </span>
    );
  },
);

Container.displayName = 'Container';
