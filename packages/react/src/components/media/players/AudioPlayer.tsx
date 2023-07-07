import { AudioPlayerProps as AudioPlayerCoreProps } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import { canPlayMediaNatively } from 'livepeer/media/browser';
import { styling } from 'livepeer/media/browser/styling';
import * as React from 'react';

import { PosterSource } from './Player';
import { useMediaController } from '../../../context';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  fullscreen,
});

export type AudioPlayerProps = AudioPlayerCoreProps<
  HTMLAudioElement,
  PosterSource,
  object,
  any
> & {
  allowCrossOriginCredentials?: boolean;
};

export const AudioPlayer = React.forwardRef<HTMLAudioElement, AudioPlayerProps>(
  (
    {
      src,
      autoPlay,
      title,
      loop,
      muted,
      objectFit,
      allowCrossOriginCredentials,
    },
    ref,
  ) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const filteredSources = React.useMemo(() => {
      return src?.filter((s) => s?.mime && canPlayMediaNatively(s)) ?? [];
    }, [src]);

    return (
      <audio
        className={styling.media.audio({
          size: fullscreen ? 'fullscreen' : objectFit,
        })}
        loop={loop}
        aria-label={title ?? 'Audio player'}
        role="audio"
        autoPlay={autoPlay}
        ref={ref}
        webkit-playsinline="true"
        playsInline
        muted={muted}
        crossOrigin={
          allowCrossOriginCredentials ? 'use-credentials' : 'anonymous'
        }
      >
        {filteredSources.map((source) => (
          <source key={source.src} src={source.src} type={source.mime!} />
        ))}
        {
          "Your browser doesn't support the HTML5 <code>audio</code> tag, or the audio format."
        }
      </audio>
    );
  },
);

AudioPlayer.displayName = 'AudioPlayer';
