import { VideoPlayerProps as VideoPlayerCoreProps } from '@livepeer/core-react/components';
import { MediaControllerState } from 'livepeer';
import {
  addMediaMetricsToInitializedStore,
  canPlayMediaNatively,
} from 'livepeer/media/browser';
import { HlsVideoConfig, isHlsSupported } from 'livepeer/media/browser/hls';
import { isWebRTCSupported } from 'livepeer/media/browser/webrtc';
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
  hlsConfig?: HlsVideoConfig;
  allowCrossOriginCredentials?: boolean;
};

export const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (props, ref) => {
    const { fullscreen } = useMediaController(mediaControllerSelector);

    const { src, onMetricsError, onError } = props;

    const [canUseHlsjs, canUseWebRTC] = React.useMemo(
      () => [isHlsSupported(), isWebRTCSupported()],
      [],
    );

    const [currentSourceIndex, setCurrentSourceIndex] = React.useState(0);
    const incrementSourceIndex = React.useCallback(() => {
      setCurrentSourceIndex((prevIndex) => {
        // increment by 1 and use modulo to limit it to the source array's length
        return (prevIndex + 1) % (src?.length ?? 0);
      });
    }, [setCurrentSourceIndex, src]);

    const onErrorComposed = React.useCallback(
      async (error: Error) => {
        onError?.(error);

        /** Limit reconnection attempts to at-most once every 5 seconds */
        await new Promise((r) => setTimeout(r, 5000));

        incrementSourceIndex();
      },
      [incrementSourceIndex, onError],
    );

    const currentPlaybackSource = React.useMemo(
      () => src?.[currentSourceIndex] ?? null,
      [src, currentSourceIndex],
    );

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
    }, [
      src,
      canUseHlsjs,
      canUseWebRTC,
      currentPlaybackSource,
      incrementSourceIndex,
    ]);

    const store = React.useContext(MediaControllerContext);

    React.useEffect(() => {
      const { destroy } = addMediaMetricsToInitializedStore(
        store,
        currentPlaybackSource?.src,
        (e) => {
          onMetricsError?.(e as Error);
          console.error('Not able to report player metrics', e);
        },
      );

      return destroy;
    }, [onMetricsError, store, currentPlaybackSource]);

    return currentPlaybackSource?.type === 'webrtc' ? (
      <WebRTCVideoPlayer
        {...props}
        ref={ref}
        src={currentPlaybackSource}
        fullscreen={fullscreen}
        onError={onErrorComposed}
      />
    ) : currentPlaybackSource?.type === 'hls' ? (
      <HLSVideoPlayer
        {...props}
        ref={ref}
        src={currentPlaybackSource}
        fullscreen={fullscreen}
        onError={onErrorComposed}
      />
    ) : (
      <HtmlVideoPlayer
        {...props}
        ref={ref}
        src={currentPlaybackSource}
        fullscreen={fullscreen}
        onError={onErrorComposed}
      />
    );
  },
);
