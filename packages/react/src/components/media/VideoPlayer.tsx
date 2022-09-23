import {
  MediaControllerState,
  VideoSrc,
  canPlayMediaNatively,
  styling,
} from 'livepeer';
import * as React from 'react';

import { HlsPlayerProps } from './HlsPlayer';
import { useMediaController } from './context';

export type VideoPlayerProps = Omit<HlsPlayerProps, 'hlsConfig' | 'src'> & {
  src: VideoSrc | VideoSrc[];
};

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, autoPlay, title, loop, muted, poster }, ref) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const filteredSources = React.useMemo(() => {
      const sources = Array.isArray(src) ? src : [src];
      return sources.filter((s) => s?.mime && canPlayMediaNatively(s.mime));
    }, [src]);

    return (
      <video
        className={styling.media.video({
          size: fullscreen ? 'fullscreen' : 'default',
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
        {filteredSources.map((source) => (
          <source key={source.src} src={source.src} type={source.mime!} />
        ))}
        {
          "Your browser doesn't support the HTML5 <code>video</code> tag, or the video format."
        }
      </video>
    );
  },
);

VideoPlayer.displayName = 'VideoPlayer';
