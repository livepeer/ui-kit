import * as React from 'react';
import Video from 'react-native-video';

import { useMediaController } from '../../../context';
import { NativeMediaControllerState } from '../state';

const mediaControllerSelector = ({
  fullscreen,
}: NativeMediaControllerState<Video>) => ({
  fullscreen,
});

export type ContainerProps = {
  aspectRatio: AspectRatio;
  children: React.ReactNode;
  className?: string;
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props, ref) => {
    const { children, className, aspectRatio } = props;

    const { fullscreen } = useMediaController(mediaControllerSelector);

    return (
      <div
        style={{
          display: 'contents',
        }}
        className={className}
      >
        <div
          className={styling.container({
            aspectRatio,
            size: fullscreen ? 'fullscreen' : 'default',
          })}
          ref={ref}
          tabIndex={0}
        >
          {children}
        </div>
      </div>
    );
  },
);

Container.displayName = 'Container';
