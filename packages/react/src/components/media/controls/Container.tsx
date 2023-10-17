import { ContainerProps as CoreContainerProps } from '@livepeer/core-react/components';
import { MediaControllerState } from '@livepeer/core-web';

import { styling } from '@livepeer/core-web/media/browser/styling';
import * as React from 'react';

import { useMediaController, useTheme } from '../../../context';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  fullscreen,
});

export type ContainerProps = CoreContainerProps & {
  tabIndex?: number;
};

export const Container: React.FC<ContainerProps> = (props) => {
  const { children, aspectRatio, theme, tabIndex } = props;

  // cast response from useTheme to string
  const className = useTheme(theme) as string;

  const { fullscreen } = useMediaController(mediaControllerSelector);

  return (
    <div
      style={{
        display: 'contents',
      }}
      className={`${
        className ? `${className} ` : ''
      }livepeer-contents-container`}
    >
      <div
        className={`${styling.container({
          aspectRatio,
          size: fullscreen ? 'fullscreen' : 'default',
        })} livepeer-aspect-ratio-container`}
        tabIndex={tabIndex ?? 0}
      >
        {children}
      </div>
    </div>
  );
};
