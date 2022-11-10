import { VideoSrc, canPlayMediaNatively } from 'livepeer/media';
import * as React from 'react';
import Video from 'react-native-video';

import { useMediaController } from '../../../context';
import { NativeMediaControllerState } from '../state';

import { HlsPlayerProps } from './HlsPlayer';

export type VideoPlayerProps = Omit<HlsPlayerProps, 'hlsConfig' | 'src'> & {
  src: VideoSrc[] | null;
};

const mediaControllerSelector = ({
  fullscreen,
}: NativeMediaControllerState<Video>) => ({
  fullscreen,
});

export const VideoPlayer = React.forwardRef<Video, VideoPlayerProps>(
  ({ src, autoPlay, title, loop, muted, poster, objectFit }, ref) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const filteredSources = React.useMemo(() => {
      return src?.filter((s) => s?.mime && canPlayMediaNatively(s.mime));
    }, [src]);

    return (
      <Video
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
        poster={poster}
      >
        {filteredSources?.map((source) => (
          <source key={source.src} src={source.src} type={source.mime!} />
        ))}
        {
          "Your browser doesn't support the HTML5 <code>video</code> tag, or the video format."
        }
      </Video>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';
