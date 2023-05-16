import { addMediaMetricsToStore } from '@livepeer/core-react';
import { VideoPlayerProps as VideoPlayerCoreProps } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import { canPlayMediaNatively } from 'livepeer/media/browser';
import { HlsVideoConfig, isHlsSupported } from 'livepeer/media/browser/hls';
import {
  WebRTCVideoConfig,
  isWebRTCSupported,
} from 'livepeer/media/browser/webrtc';
import * as React from 'react';

import { HLSVideoPlayer } from './HLSVideoPlayer';
import { HtmlVideoPlayer } from './HTMLVideoPlayer';
import { WebRTCVideoPlayer } from './WebRTCVideoPlayer';
import {
  MediaControllerContext,
  useMediaController,
} from '../../../../context';
import { PosterSource } from '../../Player';

const mediaControllerSelector = ({
  fullscreen,
}: MediaControllerState<HTMLMediaElement>) => ({
  fullscreen,
});

export type VideoPlayerProps = VideoPlayerCoreProps<
  HTMLVideoElement,
  PosterSource,
  object
> & {
  allowCrossOriginCredentials?: boolean;
  hlsConfig?: HlsVideoConfig;
  webrtcConfig?: WebRTCVideoConfig;
};

const InternalVideoPlayer = React.forwardRef<
  HTMLVideoElement,
  VideoPlayerProps
>((props, ref) => {
  const { fullscreen } = useMediaController(mediaControllerSelector);

  const { src, onPlaybackError, playbackError } = props;

  const [canUseHlsjs, canUseWebRTC] = React.useMemo(
    () => [isHlsSupported(), isWebRTCSupported()],
    [],
  );

  const [currentSourceIndex, setCurrentSourceIndex] = React.useState(0);
  const incrementSourceIndex = React.useCallback(() => {
    setCurrentSourceIndex((prev) => prev + 1);
  }, [setCurrentSourceIndex]);

  const currentPlaybackSource = React.useMemo(
    // use modulo to limit it to the source array's length
    () => src?.[currentSourceIndex % (src?.length ?? 0)] ?? null,
    [src, currentSourceIndex],
  );

  // we increment the source for stream offline errors for WebRTC
  React.useEffect(() => {
    if (
      playbackError?.type === 'offline' &&
      currentPlaybackSource?.type === 'webrtc'
    ) {
      incrementSourceIndex();
    }
  }, [playbackError, incrementSourceIndex, currentPlaybackSource]);

  // we increment the source on an unknown error
  React.useEffect(() => {
    if (playbackError?.type === 'unknown') {
      incrementSourceIndex();
    }
  }, [incrementSourceIndex, playbackError]);

  // we auto-increment the index of the playback source if it can't be handled
  React.useEffect(() => {
    const shouldTryNextSource =
      (currentPlaybackSource?.type === 'webrtc' && !canUseWebRTC) ||
      (currentPlaybackSource?.type === 'hls' && !canUseHlsjs) ||
      (currentPlaybackSource?.type === 'video' &&
        !canPlayMediaNatively(currentPlaybackSource));

    if (shouldTryNextSource) {
      incrementSourceIndex();
    }
  }, [canUseHlsjs, canUseWebRTC, currentPlaybackSource, incrementSourceIndex]);

  const store = React.useContext(MediaControllerContext);

  React.useEffect(() => {
    if (currentPlaybackSource) {
      store?.getState?.()?._updateSource?.(currentPlaybackSource?.src);
    }
  }, [currentPlaybackSource]);

  React.useEffect(() => {
    console.log({ currentPlaybackSource });
  }, [currentPlaybackSource]);

  React.useEffect(() => {
    const { destroy } = addMediaMetricsToStore(store, (e) => {
      onPlaybackError?.(e as Error);
      console.error('Not able to report player metrics', e);
    });

    // preload:
    //   element?.preload === 'auto'
    //     ? 'full'
    //     : element?.preload === 'metadata'
    //     ? 'metadata'
    //     : 'none',

    return destroy;
  }, [onPlaybackError, store]);

  return currentPlaybackSource?.type === 'webrtc' ? (
    <WebRTCVideoPlayer
      {...props}
      ref={ref}
      src={currentPlaybackSource}
      fullscreen={fullscreen}
    />
  ) : currentPlaybackSource?.type === 'hls' ? (
    <HLSVideoPlayer
      {...props}
      ref={ref}
      src={currentPlaybackSource}
      fullscreen={fullscreen}
    />
  ) : (
    <HtmlVideoPlayer
      {...props}
      ref={ref}
      src={currentPlaybackSource}
      fullscreen={fullscreen}
    />
  );
});

export const VideoPlayer = React.memo(InternalVideoPlayer);
