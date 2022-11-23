import { ContainerProps } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';

import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { useMediaController, useTheme } from '../../../context';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export type { ContainerProps };

export const Container: React.FC<ContainerProps> = (props) => {
  const { children, aspectRatio, theme } = props;

  const className = useTheme(theme);

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
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};
