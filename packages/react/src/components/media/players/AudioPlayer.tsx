import { AudioSrc, canPlayMediaNatively } from 'livepeer/media';
import { MediaControllerState } from 'livepeer/media/controls';
import { styling } from 'livepeer/styling';
import * as React from 'react';

import { useMediaController } from '../../../context';
import { HlsPlayerProps } from './HlsPlayer';

export type AudioPlayerProps = Omit<
  HlsPlayerProps,
  'hlsConfig' | 'src' | 'poster'
> & {
  src: AudioSrc[];
};

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export const AudioPlayer = React.forwardRef<HTMLAudioElement, AudioPlayerProps>(
  ({ src, autoPlay, title, loop, muted, objectFit }, ref) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const filteredSources = React.useMemo(() => {
      return src.filter((s) => s?.mime && canPlayMediaNatively(s.mime));
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
