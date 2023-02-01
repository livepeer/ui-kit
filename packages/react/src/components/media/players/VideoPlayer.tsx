import { VideoPlayerProps } from '@livepeer/core-react/components';
import { MediaControllerState, VideoSrc } from 'livepeer';
import { canPlayMediaNatively } from 'livepeer/media/browser';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { isAccessControlError } from './utils';
import { useMediaController } from '../../../context';
import { PosterSource } from '../Player';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export type { VideoPlayerProps };

export const VideoPlayer = React.forwardRef<
  HTMLVideoElement,
  VideoPlayerProps<HTMLVideoElement, PosterSource>
>(
  (
    {
      src,
      autoPlay,
      title,
      loop,
      muted,
      poster,
      objectFit,
      onAccessControlError,
    },
    ref,
  ) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const [filteredSources, setFilteredSources] = React.useState<
      VideoSrc[] | undefined
    >();

    React.useEffect(() => {
      setFilteredSources(
        src?.filter((s) => s?.mime && canPlayMediaNatively(s)),
      );
    }, [src]);

    const handleError = React.useCallback(
      (error: Error) => {
        if (isAccessControlError(error)) {
          onAccessControlError?.(error);
        }
        console.warn(error.message);
      },
      [onAccessControlError],
    );

    const onVideoError = React.useCallback(
      (event: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        // TODO: handleError(...)
        console.log('video error', event);
        handleError(new Error('Generic video error'));
      },
      [handleError],
    );

    const onSourceError = React.useCallback(
      (event: React.SyntheticEvent<HTMLSourceElement, Event>) => {
        // TODO: handleError(...)
        console.log('source error', event);
        handleError(new Error('Generic source error'));
      },
      [handleError],
    );

    return (
      <video
        className={styling.media.video({
          size: fullscreen ? 'fullscreen' : objectFit,
        })}
        loop={loop}
        aria-label={title ?? 'Video player'}
        role="video"
        autoPlay={autoPlay}
        width="100%"
        height="100%"
        ref={ref}
        webkit-playsinline="true"
        playsInline
        muted={muted}
        poster={typeof poster === 'string' ? poster : undefined}
        onError={onVideoError}
      >
        {filteredSources?.map((source) => (
          <source
            key={source.src}
            src={source.src}
            type={source.mime!}
            onError={onSourceError}
          />
        ))}
        {
          "Your browser doesn't support the HTML5 <code>video</code> tag, or the video format."
        }
      </video>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';
