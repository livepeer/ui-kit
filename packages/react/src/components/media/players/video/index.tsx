import { VideoSrc, addMediaMetricsToStore } from '@livepeer/core-react';
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
  lowLatency?: boolean;
};

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): { debouncedFn: T; cancel: () => void } {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFn = ((...args: Parameters<T>) => {
    if (timeoutId === null) {
      timeoutId = setTimeout(() => {
        timeoutId = null;
        fn(...args);
      }, delay);
    }
  }) as T;

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return { debouncedFn, cancel };
}

const InternalVideoPlayer = React.forwardRef<
  HTMLVideoElement,
  VideoPlayerProps
>((props, ref) => {
  const { fullscreen } = useMediaController(mediaControllerSelector);

  const { src, onPlaybackError, playbackError, lowLatency } = props;

  const [canUseHlsjs, canUseWebRTC] = React.useMemo(
    () => [isHlsSupported(), isWebRTCSupported()],
    [],
  );

  // we map the HLS sources to be a "video" source instead, if HLS.js is not supported
  const playbackMappedSources = React.useMemo(
    () =>
      src
        ?.filter((s) => (lowLatency ? true : s.type !== 'webrtc'))
        ?.map((s) =>
          s.type === 'hls' && !canUseHlsjs
            ? ({
                ...s,
                type: 'video',
                mime: 'application/vnd.apple.mpegurl',
              } as VideoSrc)
            : s,
        ),
    [src, canUseHlsjs, lowLatency],
  );

  const [currentSourceIndex, setCurrentSourceIndex] = React.useState(0);

  const incrementSourceIndex = React.useCallback(() => {
    setCurrentSourceIndex((prev) => prev + 1);
  }, [setCurrentSourceIndex]);

  // update the debounced function when currentSourceIndex changes
  const { debouncedFn: debouncedIncrementSourceIndex, cancel } = React.useMemo(
    () => debounce(incrementSourceIndex, 1000 * 2 ** currentSourceIndex),
    [incrementSourceIndex, currentSourceIndex],
  );

  // Store the debounced function and cancel method in refs
  const debouncedIncrementSourceIndexRef = React.useRef(
    debouncedIncrementSourceIndex,
  );
  const cancelRef = React.useRef(cancel);

  React.useEffect(() => {
    debouncedIncrementSourceIndexRef.current = debouncedIncrementSourceIndex;
    cancelRef.current = cancel;
  }, [debouncedIncrementSourceIndex, cancel]);

  const currentPlaybackSource = React.useMemo(
    // use modulo to limit it to the source array's length
    () =>
      playbackMappedSources?.[
        currentSourceIndex % (playbackMappedSources?.length ?? 0)
      ] ?? null,
    [playbackMappedSources, currentSourceIndex],
  );

  // we increment the source for stream offline errors for WebRTC
  React.useEffect(() => {
    if (
      playbackError?.type === 'offline' &&
      currentPlaybackSource?.type !== 'hls'
    ) {
      debouncedIncrementSourceIndexRef?.current?.();
    }
  }, [playbackError, currentPlaybackSource]);

  // we increment the source on an unknown error
  // and we clear the timeout if we have a null playbackError
  React.useEffect(() => {
    if (playbackError?.type === 'unknown') {
      debouncedIncrementSourceIndexRef?.current?.();
    } else if (playbackError === null) {
      cancelRef?.current?.();
    }
  }, [playbackError]);

  // we auto-increment the index of the playback source if it can't be handled
  React.useEffect(() => {
    const shouldTryNextSource =
      (currentPlaybackSource?.type === 'webrtc' && !canUseWebRTC) ||
      (currentPlaybackSource?.type === 'hls' && !canUseHlsjs) ||
      (currentPlaybackSource?.type === 'video' &&
        !canPlayMediaNatively(currentPlaybackSource));

    if (shouldTryNextSource) {
      debouncedIncrementSourceIndexRef?.current?.();
    }
  }, [canUseHlsjs, canUseWebRTC, currentPlaybackSource]);

  const store = React.useContext(MediaControllerContext);

  React.useEffect(() => {
    if (currentPlaybackSource) {
      store?.getState?.()?._updateSource?.(currentPlaybackSource?.src);
    }
  }, [store, currentPlaybackSource]);

  React.useEffect(() => {
    const { destroy } = addMediaMetricsToStore(store, (e) => {
      onPlaybackError?.(e as Error);
      console.error('Not able to report player metrics', e);
    });

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
