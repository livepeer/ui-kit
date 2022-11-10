import { AudioSrc } from 'livepeer/media';
import * as React from 'react';
import Video from 'react-native-video';

import { useMediaController } from '../../../context';
import { NativeMediaControllerState } from '../state';
import { HlsPlayerProps } from './HlsPlayer';

export type AudioPlayerProps = Omit<
  HlsPlayerProps,
  'hlsConfig' | 'src' | 'poster'
> & {
  src: AudioSrc[];
};

const mediaControllerSelector = ({
  fullscreen,
}: NativeMediaControllerState<Video>) => ({
  fullscreen,
});

export const AudioPlayer = React.forwardRef<Video, AudioPlayerProps>(
  ({ src, autoPlay, title, loop, muted, objectFit }, ref) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const filteredSources = React.useMemo(() => {
      return src.filter((s) => s?.mime && canPlayMediaNatively(s.mime));
    }, [src]);

    return (
      <Video
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
      </Video>
    );
  },
);

AudioPlayer.displayName = 'AudioPlayer';
