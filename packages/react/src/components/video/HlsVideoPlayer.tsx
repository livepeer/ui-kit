import {
  HlsVideoConfig,
  MediaControllerState,
  createNewHls,
  isHlsSupported,
} from 'livepeer';
import * as React from 'react';

import { useMediaController } from './context';

export type GenericHlsVideoPlayerProps =
  React.VideoHTMLAttributes<HTMLVideoElement> & {
    hlsConfig?: HlsVideoConfig;
    controls?: boolean;
    width?: string | number;
  };

const mediaControllerSelector = ({
  _element,
  requestVolume,
}: MediaControllerState<HTMLMediaElement>) => ({
  element: _element,
  requestVolume,
});

export type HlsVideoPlayerProps = GenericHlsVideoPlayerProps & {
  src: string;
};

export const HlsVideoPlayer = React.forwardRef<
  HTMLVideoElement,
  HlsVideoPlayerProps
>(
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
    const { element, requestVolume } = useMediaController(
      mediaControllerSelector,
    );

    React.useEffect(() => {
      if (props.muted) {
        requestVolume(0);
      }
    }, [props.muted, requestVolume]);

    React.useEffect(() => {
      if (element && typeof window !== 'undefined' && isHlsSupported()) {
        const { destroy } = createNewHls(src, element, {
          autoplay: autoPlay,
          ...hlsConfig,
        });

        return () => {
          destroy();
        };
      }
    }, [autoPlay, hlsConfig, src, element]);

    const isMediaSourceSupported = React.useMemo(
      () => typeof window !== 'undefined' && isHlsSupported(),
      [],
    );

    // if Media Source is supported, use HLS.js to play video
    // fallback to using a regular video player if HLS is supported by default in the user's browser
    return isMediaSourceSupported ? (
      <video
        aria-label="video-player"
        role="video"
        controls={controls}
        width={width}
        ref={ref}
        {...props}
      />
    ) : (
      <video
        aria-label="video-player"
        role="video"
        src={src}
        autoPlay={autoPlay}
        controls={controls}
        width={width}
        ref={ref}
        {...props}
      />
    );
  },
);

HlsVideoPlayer.displayName = 'HlsVideoPlayer';
