import {
  HlsVideoConfig,
  MediaControllerState,
  createNewHls,
  isHlsSupported,
} from 'livepeer';
import * as React from 'react';

import { useMediaController } from '../context';

export type GenericHlsPlayerProps =
  React.VideoHTMLAttributes<HTMLVideoElement> & {
    hlsConfig?: HlsVideoConfig;
    controls?: boolean;
    width?: string | number;
  };

const mediaControllerSelector = ({
  _element,
}: MediaControllerState<HTMLMediaElement>) => ({
  element: _element,
});

export type HlsPlayerProps = GenericHlsPlayerProps & {
  src: string;
};

export const HlsPlayer = React.forwardRef<HTMLVideoElement, HlsPlayerProps>(
  (
    {
      hlsConfig,
      src,
      autoPlay = true,
      controls = true,
      width = '100%',
      ...props
    },
    ref,
  ) => {
    const { element } = useMediaController(mediaControllerSelector);

    const [isMediaSourceSupported, canPlayAppleMpeg] = React.useMemo(
      () => [
        typeof window !== 'undefined' && isHlsSupported(),
        element ? element.canPlayType('application/vnd.apple.mpegurl') : null,
      ],
      [element],
    );

    React.useEffect(() => {
      if (element && isMediaSourceSupported && !canPlayAppleMpeg) {
        const { destroy } = createNewHls(src, element, {
          autoplay: autoPlay,
          ...hlsConfig,
        });

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
    ]);

    // if HLS is supported by default in the user's browser, use video player
    // if Media Source is supported, use HLS.js to play video
    // fallback to using a regular video player
    return canPlayAppleMpeg === 'probably' || canPlayAppleMpeg === 'maybe' ? (
      <video
        {...props}
        aria-label="video-player"
        role="video"
        src={src}
        autoPlay={autoPlay}
        controls={controls}
        width={width}
        ref={ref}
        webkit-playsinline="true"
        playsInline
      />
    ) : isMediaSourceSupported ? (
      <video
        {...props}
        aria-label="video-player"
        role="video"
        controls={controls}
        width={width}
        ref={ref}
        webkit-playsinline="true"
        playsInline
        autoPlay={autoPlay}
      />
    ) : (
      // TODO handle this case better
      <video
        {...props}
        aria-label="video-player"
        role="video"
        src={src}
        autoPlay={autoPlay}
        controls={controls}
        width={width}
        ref={ref}
        webkit-playsinline="true"
        playsInline
      />
    );
  },
);

HlsPlayer.displayName = 'HlsPlayer';
