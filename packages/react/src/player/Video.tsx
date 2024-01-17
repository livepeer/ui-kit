import type * as Radix from "@radix-ui/react-primitive";

import React from "react";
import { useStore } from "zustand";

import { PlayerScopedProps, usePlayerContext } from "../context/PlayerContext";
import { Primitive } from "./primitive";

const VIDEO_NAME = "PlayerVideo";

type VideoElement = React.ElementRef<typeof Primitive.video>;

interface VideoProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.video> {}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: PlayerScopedProps<VideoProps>, forwardedRef) => {
    const { __scopePlayer, ...contentProps } = props;

    const context = usePlayerContext(VIDEO_NAME, __scopePlayer);

    // useEffect(() => {
    //   context.store.getState()._updateSource;
    // }, []);

    const src = useStore(context.store, (state) => state.currentSource);

    // const { fullscreen, setPlaybackError } = useMediaController(
    //   mediaControllerSelector,
    // );

    // const {
    //   src,
    //   onPlaybackError,
    //   playbackError,
    //   lowLatency = true,
    //   onPlaybackStatusUpdate,
    //   playbackStatusSelector,
    //   webrtcConfig,
    // } = props;

    const [canUseHlsjs, canUseWebRTC] = React.useMemo(
      () => [isHlsSupported(), isWebRTCSupported()],
      [],
    );

    // we map the HLS sources to be a "video" source instead, if HLS.js is not supported
    const playbackMappedSources = React.useMemo(
      () =>
        src
          ?.filter((s) =>
            lowLatency === "force" && src?.some((s) => s?.type === "webrtc")
              ? s.type === "webrtc"
              : lowLatency
                ? true
                : s.type !== "webrtc",
          )
          ?.map((s) => {
            const url = new URL(s.src);

            // append the JWT to the query params
            if (props.jwt) {
              url.searchParams.append("jwt", props.jwt);
            }
            // append the access key to the query params
            else if (props.accessKey) {
              url.searchParams.append("accessKey", props.accessKey);
            }

            return s.type === "hls" && !canUseHlsjs
              ? ({
                  ...s,
                  src: url.toString(),
                  type: "video",
                  mime: "application/vnd.apple.mpegurl",
                } as VideoSrc)
              : s;
          }),
      [src, canUseHlsjs, props.jwt, props.accessKey, lowLatency],
    );

    const [currentSourceIndex, setCurrentSourceIndex] = React.useState(0);

    const incrementSourceIndex = React.useCallback(() => {
      setCurrentSourceIndex((prev) => prev + 1);
    }, []);

    // update the debounced function when currentSourceIndex changes
    const { debouncedFn: debouncedIncrementSourceIndex, cancel } =
      React.useMemo(
        () => debounce(incrementSourceIndex, 500 * currentSourceIndex),
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

    // we increment the source on a bframes or  unknown error
    // and we clear the timeout if we have a null playbackError
    React.useEffect(() => {
      if (
        playbackError?.type === "fallback" ||
        playbackError?.type === "unknown"
      ) {
        debouncedIncrementSourceIndexRef?.current?.();
      } else if (playbackError === null) {
        cancelRef?.current?.();
      }

      setPlaybackError(playbackError);
    }, [playbackError, setPlaybackError]);

    // we auto-increment the index of the playback source if it can't be handled
    React.useEffect(() => {
      const shouldTryNextSource =
        (currentPlaybackSource?.type === "webrtc" && !canUseWebRTC) ||
        (currentPlaybackSource?.type === "hls" && !canUseHlsjs) ||
        (currentPlaybackSource?.type === "video" &&
          !canPlayMediaNatively(currentPlaybackSource));

      if (shouldTryNextSource) {
        debouncedIncrementSourceIndexRef?.current?.();
      }
    }, [canUseHlsjs, canUseWebRTC, currentPlaybackSource]);

    // const store = React.useContext(MediaControllerContext);

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
    //   return store.subscribe(
    //     stateSelector,
    //     (state, prevState) =>
    //       onPlaybackStatusUpdate?.(
    //         sanitizeMediaControllerState(
    //           state as MediaControllerState<HTMLVideoElement, never>,
    //         ),
    //         sanitizeMediaControllerState(
    //           prevState as MediaControllerState<HTMLVideoElement, never>,
    //         ),
    //       ),
    //   );
    // }, [onPlaybackStatusUpdate, stateSelector, store]);

    // React.useEffect(() => {
    //   if (currentPlaybackSource) {
    //     store?.getState?.()?._updateSource?.(currentPlaybackSource?.src);
    //   }
    // }, [store, currentPlaybackSource]);

    React.useEffect(() => {
      if (!playbackError && currentPlaybackSource?.type === "webrtc") {
        const id = setTimeout(() => {
          if (!store.getState().canPlay) {
            onPlaybackError(
              new Error(
                "Timeout reached for canPlay - triggering playback error.",
              ),
            );
          }
        }, webrtcConfig?.canPlayTimeout ?? 7000);

        return () => {
          clearTimeout(id);
        };
      }
    }, [
      store,
      playbackError,
      onPlaybackError,
      webrtcConfig?.canPlayTimeout,
      currentPlaybackSource,
    ]);

    // React.useEffect(() => {
    //   const { destroy } = addMediaMetricsToStore(store, (e) => {
    //     onPlaybackError?.(e as Error);
    //     console.error('Not able to report player metrics', e);
    //   });

    //   return destroy;
    // }, [onPlaybackError, store]);

    return (
      <Primitive.video
        src={src?.src}
        // data-state={getState(open)}
        {...contentProps}
        ref={forwardedRef}
      />
    );
  },
);

export { Video };
export type { VideoProps };
