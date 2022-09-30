import {
  HlsSrc,
  HlsVideoConfig,
  MediaControllerState,
  canPlayMediaNatively,
  createNewHls,
  isHlsSupported,
  styling,
} from 'livepeer';
import * as React from 'react';

import { PlayerObjectFit } from './Player';
import { VideoPlayer } from './VideoPlayer';
import { useMediaController } from './context';

export type HlsPlayerProps = {
  src: HlsSrc;
  objectFit: PlayerObjectFit;
  hlsConfig?: HlsVideoConfig;
  controls?: boolean;
  width?: string | number;
  autoPlay?: boolean;
  loop?: boolean;
  title?: string;
  muted?: boolean;
  poster?: string;
};

const mediaControllerSelector = ({
  _element,
  fullscreen,
  setLive,
  onDurationChange,
  onCanPlay,
}: MediaControllerState<HTMLMediaElement>) => ({
  element: _element,
  fullscreen,
  setLive,
  onDurationChange,
  onCanPlay,
});

export const HlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  (props, ref) => {
    const { hlsConfig, src, autoPlay, title, loop, muted, poster, objectFit } =
      props;

    const { element, fullscreen, setLive, onDurationChange, onCanPlay } =
      useMediaController(mediaControllerSelector);

    const [canUseHlsjs, canPlayAppleMpeg] = React.useMemo(
      () => [
        isHlsSupported(),
        canPlayMediaNatively('application/vnd.apple.mpegurl'),
      ],
      [],
    );

    React.useEffect(() => {
      if (element && canUseHlsjs && !canPlayAppleMpeg && src) {
        const { destroy } = createNewHls(
          src,
          element,
          setLive,
          onDurationChange,
          onCanPlay,
          {
            autoplay: autoPlay,
            ...hlsConfig,
          },
        );

        return () => {
          destroy();
        };
      }
    }, [
      autoPlay,
      hlsConfig,
      src,
      element,
      canUseHlsjs,
      canPlayAppleMpeg,
      setLive,
      onDurationChange,
      onCanPlay,
    ]);

    // if Media Source is supported and if HLS is not supported by default in the user's browser, use HLS.js
    // fallback to using a regular video player
    return !canPlayAppleMpeg && canUseHlsjs ? (
      <video
        className={styling.media.video({
          size: fullscreen ? 'fullscreen' : objectFit,
        })}
        loop={loop}
        aria-label={title ?? 'Video player'}
        role="video"
        width="100%"
        height="100%"
        ref={ref}
        webkit-playsinline="true"
        playsInline
        autoPlay={autoPlay}
        muted={muted}
        poster={poster}
      />
    ) : (
      <VideoPlayer
        {...props}
        ref={ref}
        src={[
          {
            ...src,
            type: 'video',
          },
        ]}
      />
    );
  },
);

HlsPlayer.displayName = 'HlsPlayer';
