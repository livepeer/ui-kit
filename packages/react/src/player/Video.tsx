"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useStore } from "zustand";

import { composeEventHandlers } from "@radix-ui/primitive";
import { addEventListeners } from "@livepeer/core-web/browser";
import { createNewWHEP } from "@livepeer/core-web/webrtc";
import { HlsError, createNewHls } from "@livepeer/core-web/hls";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { PlayerScopedProps, usePlayerContext } from "../context";

import * as Radix from "./primitive";
import {
  ACCESS_CONTROL_ERROR_MESSAGE,
  BFRAMES_ERROR_MESSAGE,
  STREAM_OFFLINE_ERROR_MESSAGE,
} from "@livepeer/core-react";
import { useShallow } from "zustand/react/shallow";

const VIDEO_NAME = "PlayerVideo";

type VideoElement = React.ElementRef<typeof Radix.Primitive.video>;

interface VideoProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.video>,
    "src"
  > {
  disablePoster?: boolean;
  /** Controls how often the poster image updates when playing back a livestream, in ms. Set to `0` to disable. Defaults to 20s. */
  posterLiveUpdate?: number;
}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: PlayerScopedProps<VideoProps>, forwardedRef) => {
    const {
      __scopePlayer,
      style,
      disablePoster,
      posterLiveUpdate = 20000,
      ...contentProps
    } = props;

    const context = usePlayerContext(VIDEO_NAME, __scopePlayer);

    const ref = React.useRef<VideoElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const {
      playbackState,
      currentSource,
      isHlsSupported,
      error,
      errorCount,
      __controlsFunctions,
      __initialProps,
      thumbnail,
      live,
    } = useStore(
      context.store,
      useShallow(
        ({
          playbackState,
          currentSource,
          __initialProps,
          __controlsFunctions,
          __device,
          error,
          errorCount,
          thumbnail,
          live,
        }) => ({
          playbackState,
          currentSource,
          isHlsSupported: __device.isHlsSupported,
          error,
          errorCount,
          __controlsFunctions,
          __initialProps,
          thumbnail,
          live,
        }),
      ),
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: store
    useEffect(() => {
      const { destroy } = addEventListeners(ref.current, context.store);

      return destroy;
    }, []);

    const [posterUrl, setPosterUrl] = useState<string | null>(
      thumbnail?.src ?? null,
    );

    useEffect(() => {
      if (posterLiveUpdate && live && playbackState !== "playing") {
        const interval = setInterval(() => {
          if (thumbnail?.src) {
            const thumbnailUrl = new URL(thumbnail.src);

            thumbnailUrl.searchParams.set("p", Date.now().toFixed(0));

            setPosterUrl(thumbnailUrl.toString());
          }
        }, posterLiveUpdate);
        return () => clearInterval(interval);
      }
    }, [posterLiveUpdate, live, thumbnail, playbackState]);

    const [retryCount, setRetryCount] = useState(0);

    // biome-ignore lint/correctness/useExhaustiveDependencies: error count
    useEffect(() => {
      if (
        error &&
        (error.type === "offline" || error.type === "access-control")
      ) {
        const timeout = setTimeout(
          () => setRetryCount((retries) => retries + 1),
          errorCount * 500,
        );
        return () => clearTimeout(timeout);
      }
    }, [errorCount]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const source = useMemo(() => {
      if (currentSource.type === "hls" && !isHlsSupported) {
        return {
          ...currentSource,
          type: "video",
        } as const;
      }

      return currentSource;
    }, [currentSource.src]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: count errors
    React.useEffect(() => {
      if (source?.src) {
        const currentTime = context?.store?.getState?.()?.progress ?? 0;

        let unmounted = false;

        const onErrorComposed = (err: Error) => {
          if (!unmounted) {
            __controlsFunctions?.onError?.(err);
          }
        };

        if (source.type === "webrtc") {
          const unsubscribe = context.store.subscribe(
            (state) => Boolean(state?.__metadata?.bframes),
            (bframes) => {
              if (bframes) {
                onErrorComposed(new Error(BFRAMES_ERROR_MESSAGE));
              }
            },
          );

          const { destroy } = createNewWHEP(
            source.src,
            ref.current,
            {
              onConnected: () => __controlsFunctions.setLive(true),
              onError: onErrorComposed,
              onPlaybackOffsetUpdated:
                __controlsFunctions.updatePlaybackOffsetMs,
              onRedirect: __controlsFunctions.onFinalUrl,
            },
            {},
            // webrtcConfig,
            {
              jwt: __initialProps.jwt,
              accessKey: __initialProps.accessKey,
            },
          );

          const id = setTimeout(
            () => {
              console.log(context.store.getState().playbackState);

              if (context.store.getState().playbackState === "loading") {
                onErrorComposed(
                  new Error(
                    "Timeout reached for canPlay - triggering playback error.",
                  ),
                );
              }
            },
            // webrtcConfig?.canPlayTimeout ??
            7000,
          );

          return () => {
            clearTimeout(id);

            unmounted = true;
            unsubscribe();
            destroy();
          };
        }

        if (source.type === "hls") {
          const indexUrl = /^https?:\/\/[^/\s]+\/hls\/[^/\s]+\/index\.m3u8/g;

          const onErrorCleaned = (error: HlsError) => {
            const cleanError = new Error(
              error?.response?.data?.toString?.() ??
                (error?.response?.code === 401
                  ? ACCESS_CONTROL_ERROR_MESSAGE
                  : "Error with HLS.js"),
            );

            onErrorComposed?.(cleanError);
          };

          const { destroy } = createNewHls(
            source?.src,
            ref.current,
            {
              onLive: __controlsFunctions.setLive,
              onDuration: __controlsFunctions.onDurationChange,
              onCanPlay: __controlsFunctions.onCanPlay,
              onError: onErrorCleaned,
              onPlaybackOffsetUpdated:
                __controlsFunctions.updatePlaybackOffsetMs,
              onRedirect: __controlsFunctions.onFinalUrl,
            },
            {
              currentTime,
              autoplay: __initialProps.autoPlay,
              xhrSetup(xhr, url) {
                // xhr.withCredentials = Boolean(allowCrossOriginCredentials);

                if (url.match(indexUrl)) {
                  if (__initialProps.accessKey)
                    xhr.setRequestHeader(
                      "Livepeer-Access-Key",
                      __initialProps.accessKey,
                    );
                  else if (__initialProps.jwt)
                    xhr.setRequestHeader("Livepeer-Jwt", __initialProps.jwt);
                }
              },
              // ...hlsConfig,
            },
          );

          return () => {
            unmounted = true;
            destroy?.();
          };
        }

        if (currentSource.type === "video") {
          __controlsFunctions.onFinalUrl(source.src);

          ref.current.src = source.src;

          ref.current.load();

          const setCurrentTime = () => {
            ref.current.currentTime = currentTime;
          };

          // Set the video to the previous time after it's loaded
          ref.current.addEventListener("loadedmetadata", setCurrentTime, {
            once: true,
          });

          return () => {
            unmounted = true;
            ref.current.removeEventListener("loadedmetadata", setCurrentTime);
          };
        }
      }
    }, [source, retryCount]);

    const onVideoError: React.ReactEventHandler<HTMLVideoElement> =
      React.useCallback(
        async (e) => {
          if (source.type === "video") {
            const sourceElement = e.target;
            const parentElement = (sourceElement as HTMLSourceElement)
              ?.parentElement;
            const videoUrl =
              (parentElement as HTMLVideoElement)?.currentSrc ??
              (sourceElement as HTMLVideoElement)?.currentSrc;

            if (videoUrl) {
              try {
                const response = await fetch(videoUrl);
                if (response.status === 404) {
                  console.warn("Video not found");
                  return __controlsFunctions?.onError?.(
                    new Error(STREAM_OFFLINE_ERROR_MESSAGE),
                  );
                }
                if (response.status === 401) {
                  console.warn("Unauthorized to view video");
                  return __controlsFunctions?.onError?.(
                    new Error(ACCESS_CONTROL_ERROR_MESSAGE),
                  );
                }
              } catch (err) {
                console.warn(err);
                return __controlsFunctions?.onError?.(
                  new Error("Error fetching video URL"),
                );
              }
            }

            console.warn("Unknown error loading video");
            return __controlsFunctions?.onError?.(
              new Error("Unknown error loading video"),
            );
          }
        },
        [__controlsFunctions?.onError, source?.type],
      );

    return (
      <Radix.Primitive.video
        src={source?.type === "video" ? source.src : undefined}
        autoPlay={Boolean(__initialProps.autoPlay)}
        loop={Boolean(__initialProps.loop)}
        playsInline
        muted={__initialProps.volume === 0}
        poster={disablePoster ? undefined : posterUrl}
        {...contentProps}
        onError={composeEventHandlers(props.onError, onVideoError)}
        ref={composedRefs}
        data-livepeer-player-video=""
        data-livepeer-player-source-type={source.type}
        style={{
          ...style,
          // ensures video expands in ratio
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
    );
  },
);

export { Video };
export type { VideoProps };
