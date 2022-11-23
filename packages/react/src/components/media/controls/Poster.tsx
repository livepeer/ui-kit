import { PosterProps } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export type { PosterProps };

export const Poster: React.FC<PosterProps> = (props, ref) => {
  const { fullscreen } = useMediaController(mediaControllerSelector);

  const { content, title } = props;

  return typeof content === 'string' ? (
    <img
      className={styling.media.poster({
        size: fullscreen ? 'fullscreen' : 'default',
      })}
      aria-label={title}
      alt={title}
      ref={ref}
      src={content}
    />
  ) : React.isValidElement(content) ? (
    React.cloneElement(content as React.ReactElement, {
      className: styling.media.poster({
        size: fullscreen ? 'fullscreen' : 'default',
      }),
    })
  ) : (
    <></>
  );
};
