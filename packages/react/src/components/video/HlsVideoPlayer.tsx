import { HlsVideoConfig, createNewHls, isHlsSupported } from 'livepeer';
import * as React from 'react';

import { VideoControllerContext } from './context';

export type GenericHlsVideoPlayerProps =
  React.VideoHTMLAttributes<HTMLVideoElement> & {
    hlsConfig?: HlsVideoConfig;
    controls?: boolean;
    width?: string | number;
  };

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
    const mediaController = React.useContext(VideoControllerContext);

    React.useEffect(() => {
      if (
        mediaController?.element &&
        typeof window !== 'undefined' &&
        isHlsSupported()
      ) {
        const { destroy } = createNewHls(src, mediaController.element, {
          autoplay: autoPlay,
          ...hlsConfig,
        });

        return () => {
          destroy();
        };
      }
    }, [autoPlay, hlsConfig, src, mediaController?.element]);

    // if Media Source is supported, use HLS.js to play video
    if (typeof window !== 'undefined' && isHlsSupported())
      return (
        <video
          aria-label="video-player"
          role="video"
          controls={controls}
          width={width}
          ref={ref}
          {...props}
        />
      );

    // fallback to using a regular video player if HLS is supported by default in the user's browser
    return (
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
