import {
  AudioSrc,
  MediaControllerState,
  canPlayMediaNatively,
  styling,
} from 'livepeer';
import * as React from 'react';

import { HlsPlayerProps } from './HlsPlayer';
import { useMediaController } from './context';

export type AudioPlayerProps = Omit<
  HlsPlayerProps,
  'hlsConfig' | 'src' | 'poster'
> & {
  src: AudioSrc | AudioSrc[];
};

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export const AudioPlayer = React.forwardRef<HTMLAudioElement, AudioPlayerProps>(
  ({ src, autoPlay, title, loop, muted }, ref) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const filteredSources = React.useMemo(() => {
      const sources = Array.isArray(src) ? src : [src];
      return sources.filter((s) => s?.mime && canPlayMediaNatively(s.mime));
    }, [src]);

    return (
      <audio
        className={styling.media.audio({
          size: fullscreen ? 'fullscreen' : 'default',
        })}
        loop={loop}
        aria-label={title ?? 'Audio player'}
        role="audio"
        autoPlay={autoPlay}
        ref={ref}
        webkit-playsinline="true"
        playsInline
        muted={muted}
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
