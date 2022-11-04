import { HlsSrc, canPlayMediaNatively } from 'livepeer/media';
import { MediaControllerState } from 'livepeer/media/controls';
import {
  HlsError,
  HlsVideoConfig,
  createNewHls,
  isHlsSupported,
} from 'livepeer/media/hls';
import { styling } from 'livepeer/styling';

import * as React from 'react';

import { PlayerObjectFit } from '../Player';
import { useMediaController } from '../context';
import { VideoPlayer } from './VideoPlayer';

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
  jwt?: string;
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
      if (element && canUseHlsjs && !canPlayAppleMpeg && src.src) {
        const onError = (error: HlsError) => {
          console.warn(error.response?.data.toString());
        };
        const { destroy } = createNewHls(
          src.src,
          element,
          { onLive: setLive, onDuration: onDurationChange, onCanPlay, onError },
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
