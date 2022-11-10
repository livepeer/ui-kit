import * as React from 'react';
import Video from 'react-native-video';

import { useMediaController } from '../../../context';
import { NativeMediaControllerState } from '../state';

export type PosterProps = {
  title?: string;
  content: string | React.ReactNode;
};

const mediaControllerSelector = ({
  fullscreen,
}: NativeMediaControllerState<Video>) => ({
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
