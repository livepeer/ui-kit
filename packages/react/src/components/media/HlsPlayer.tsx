import {
  HlsVideoConfig,
  MediaControllerState,
  createNewHls,
  isHlsSupported,
  styling,
} from 'livepeer';
import * as React from 'react';

import { useMediaController } from './context';

export type GenericHlsPlayerProps =
  React.VideoHTMLAttributes<HTMLVideoElement> & {
    src: string;
    hlsConfig?: HlsVideoConfig;
    controls?: boolean;
    width?: string | number;
  };

const mediaControllerSelector = ({
  _element,
  fullscreen,
  setLive,
  onDurationChange,
}: MediaControllerState<HTMLMediaElement>) => ({
  element: _element,
  fullscreen,
  setLive,
  onDurationChange,
});

export type HlsPlayerProps = GenericHlsPlayerProps;

export const HlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  ({ hlsConfig, src, autoPlay, ...props }, ref) => {
    const { element, fullscreen, setLive, onDurationChange } =
      useMediaController(mediaControllerSelector);

    const [isMediaSourceSupported, canPlayAppleMpeg] = React.useMemo(
      () => [
        typeof window !== 'undefined' && isHlsSupported(),
        element ? element.canPlayType('application/vnd.apple.mpegurl') : null,
      ],
      [element],
    );

    React.useEffect(() => {
      if (element && isMediaSourceSupported && !canPlayAppleMpeg) {
        const { destroy } = createNewHls(
          src,
          element,
          setLive,
          onDurationChange,
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
      isMediaSourceSupported,
      canPlayAppleMpeg,
      setLive,
      onDurationChange,
    ]);

    // if Media Source is supported and if HLS is not supported by default in the user's browser, use HLS.js
    // fallback to using a regular video player
    return canPlayAppleMpeg !== 'probably' &&
      canPlayAppleMpeg !== 'maybe' &&
      isMediaSourceSupported ? (
      <video
        {...props}
        aria-label="video-player"
        role="video"
        width="100%"
        height="100%"
        ref={ref}
        webkit-playsinline="true"
        playsInline
        autoPlay={autoPlay}
        className={styling.media.video({
          size: fullscreen ? 'fullscreen' : 'default',
        })}
      />
    ) : (
      // TODO handle this case better
      <video
        {...props}
        aria-label="video-player"
        role="video"
        src={src}
        autoPlay={autoPlay}
        width="100%"
        height="100%"
        ref={ref}
        webkit-playsinline="true"
        playsInline
        className={styling.media.video({
          size: fullscreen ? 'fullscreen' : 'default',
        })}
      />
    );
  },
);

HlsPlayer.displayName = 'HlsPlayer';
