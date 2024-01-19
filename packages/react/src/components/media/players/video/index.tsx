import {
  MediaControllerCallbackState,
  VideoSrc,
  addMediaMetricsToStore,
  sanitizeMediaControllerState,
} from "@livepeer/core-react";
import { VideoPlayerProps as VideoPlayerCoreProps } from "@livepeer/core-react/components";
import { MediaControllerState } from "@livepeer/core-web";
import { canPlayMediaNatively } from "@livepeer/core-web/media/browser";
import {
  HlsVideoConfig,
  isHlsSupported,
} from "@livepeer/core-web/media/browser/hls";
import {
  WebRTCVideoConfig,
  isWebRTCSupported,
} from "@livepeer/core-web/media/browser/webrtc";
import * as React from "react";

import {
  MediaControllerContext,
  useMediaController,
} from "../../../../context";
import { PosterSource } from "../Player";
import { HLSVideoPlayer } from "./HLSVideoPlayer";
import { HtmlVideoPlayer } from "./HTMLVideoPlayer";
import { WebRTCVideoPlayer } from "./WebRTCVideoPlayer";

const mediaControllerSelector = ({
  fullscreen,
  setPlaybackError,
}: MediaControllerState<HTMLMediaElement, MediaStream>) => ({
  fullscreen,
  setPlaybackError,
});

export type VideoPlayerProps = VideoPlayerCoreProps<
  HTMLVideoElement,
  PosterSource,
  object,
  any
> & {
  allowCrossOriginCredentials?: boolean;
  hlsConfig?: HlsVideoConfig;
  webrtcConfig?: WebRTCVideoConfig;
  lowLatency?: boolean | "force";
  playRecording?: boolean;
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
  const { fullscreen, setPlaybackError } = useMediaController(
    mediaControllerSelector,
  );

  const {
    src,
    onPlaybackError,
    playbackError,
    lowLatency = true,
    onPlaybackStatusUpdate,
    playbackStatusSelector,
    webrtcConfig,
  } = props;

  // const [currentSourceIndex, setCurrentSourceIndex] = React.useState(0);

  // const incrementSourceIndex = React.useCallback(() => {
  //   setCurrentSourceIndex((prev) => prev + 1);
  // }, [setCurrentSourceIndex]);

  // // update the debounced function when currentSourceIndex changes
  // const { debouncedFn: debouncedIncrementSourceIndex, cancel } = React.useMemo(
  //   () => debounce(incrementSourceIndex, 500 * currentSourceIndex),
  //   [incrementSourceIndex, currentSourceIndex],
  // );

  // // Store the debounced function and cancel method in refs
  // const debouncedIncrementSourceIndexRef = React.useRef(
  //   debouncedIncrementSourceIndex,
  // );
  // const cancelRef = React.useRef(cancel);

  // React.useEffect(() => {
  //   debouncedIncrementSourceIndexRef.current = debouncedIncrementSourceIndex;
  //   cancelRef.current = cancel;
  // }, [debouncedIncrementSourceIndex, cancel]);

  // const currentPlaybackSource = React.useMemo(
  //   // use modulo to limit it to the source array's length
  //   () =>
  //     playbackMappedSources?.[
  //       currentSourceIndex % (playbackMappedSources?.length ?? 0)
  //     ] ?? null,
  //   [playbackMappedSources, currentSourceIndex],
  // );

  // we increment the source on a bframes or  unknown error
  // and we clear the timeout if we have a null playbackError
  // React.useEffect(() => {
  //   if (
  //     playbackError?.type === "fallback" ||
  //     playbackError?.type === "unknown"
  //   ) {
  //     debouncedIncrementSourceIndexRef?.current?.();
  //   } else if (playbackError === null) {
  //     cancelRef?.current?.();
  //   }

  //   setPlaybackError(playbackError);
  // }, [playbackError, setPlaybackError]);

  // // we auto-increment the index of the playback source if it can't be handled
  // React.useEffect(() => {
  //   const shouldTryNextSource =
  //     (currentPlaybackSource?.type === "webrtc" && !canUseWebRTC) ||
  //     (currentPlaybackSource?.type === "hls" && !canUseHlsjs) ||
  //     (currentPlaybackSource?.type === "video" &&
  //       !canPlayMediaNatively(currentPlaybackSource));

  //   if (shouldTryNextSource) {
  //     debouncedIncrementSourceIndexRef?.current?.();
  //   }
  // }, [canUseHlsjs, canUseWebRTC, currentPlaybackSource]);

  const store = React.useContext(MediaControllerContext);

  // const stateSelector = React.useCallback(
  //   (state: MediaControllerCallbackState<HTMLMediaElement, MediaStream>) => {
  //     return playbackStatusSelector
  //       ? playbackStatusSelector(
  //           state as MediaControllerState<HTMLVideoElement, never>,
  //         )
  //       : state;
  //   },
  //   [playbackStatusSelector],
  // );

  // React.useEffect(() => {
  //   return store.subscribe(stateSelector, (state, prevState) =>
  //     onPlaybackStatusUpdate?.(
  //       sanitizeMediaControllerState(
  //         state as MediaControllerState<HTMLVideoElement, never>,
  //       ),
  //       sanitizeMediaControllerState(
  //         prevState as MediaControllerState<HTMLVideoElement, never>,
  //       ),
  //     ),
  //   );
  // }, [onPlaybackStatusUpdate, stateSelector, store]);

  // React.useEffect(() => {
  //   if (!playbackError && currentPlaybackSource?.type === "webrtc") {
  //     const id = setTimeout(() => {
  //       if (!store.getState().canPlay) {
  //         onPlaybackError(
  //           new Error(
  //             "Timeout reached for canPlay - triggering playback error.",
  //           ),
  //         );
  //       }
  //     }, webrtcConfig?.canPlayTimeout ?? 7000);

  //     return () => {
  //       clearTimeout(id);
  //     };
  //   }
  // }, [
  //   store,
  //   playbackError,
  //   onPlaybackError,
  //   webrtcConfig?.canPlayTimeout,
  //   currentPlaybackSource,
  // ]);

  React.useEffect(() => {
    const { destroy } = addMediaMetricsToStore(store, (e) => {
      onPlaybackError?.(e as Error);
      console.error("Not able to report player metrics", e);
    });

    return destroy;
  }, [onPlaybackError, store]);

  return currentPlaybackSource?.type === "webrtc" ? (
    <WebRTCVideoPlayer
      {...props}
      ref={ref}
      src={currentPlaybackSource}
      fullscreen={fullscreen}
    />
  ) : currentPlaybackSource?.type === "hls" ? (
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
