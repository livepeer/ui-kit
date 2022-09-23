import { MediaControllerState, styling } from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

export type PosterProps = {
  title?: string;
  content: string | React.ReactNode;
};

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export const Poster = React.forwardRef<HTMLImageElement, PosterProps>(
  (props, ref) => {
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
  },
);
