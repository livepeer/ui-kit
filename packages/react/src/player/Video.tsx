"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "zustand";

import { addEventListeners } from "@livepeer/core-web/browser";
import { HlsError, createNewHls } from "@livepeer/core-web/hls";
import { createNewWHEP } from "@livepeer/core-web/webrtc";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { MediaScopedProps, useMediaContext } from "../context";

import {
  ACCESS_CONTROL_ERROR_MESSAGE,
  BFRAMES_ERROR_MESSAGE,
  STREAM_OFFLINE_ERROR_MESSAGE,
  Src,
} from "@livepeer/core";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";

const VIDEO_NAME = "Video";

type OmittedProps = "src" | "poster";

type VideoElement = React.ElementRef<typeof Radix.Primitive.video>;

interface VideoProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.video>,
    OmittedProps
  > {
  disablePoster?: boolean;
  /** Controls how often the poster image updates when playing back a livestream, in ms. Set to `0` to disable. Defaults to 20s. */
  posterLiveUpdate?: number;
}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: MediaScopedProps<VideoProps>, forwardedRef) => {
    const {
      __scopeMedia,
      style,
      disablePoster,
      posterLiveUpdate = 20000,
      ...videoProps
    } = props;

    const context = useMediaContext(VIDEO_NAME, __scopeMedia);

    const ref = React.useRef<VideoElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const {
      playing,
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
          playing,
          currentSource,
          __initialProps,
          __controlsFunctions,
          __device,
          error,
          errorCount,
          thumbnail,
          live,
        }) => ({
          playing,
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

    useEffect(() => {
      if (ref.current) {
        const { destroy } = addEventListeners(ref.current, context.store);

        return destroy;
      }
    }, [context?.store]);

    const [posterUrl, setPosterUrl] = useState<string | null>(
      thumbnail?.src ?? null,
    );

    useEffect(() => {
      if (posterLiveUpdate && live && !playing) {
        const interval = setInterval(() => {
          if (thumbnail?.src) {
            const thumbnailUrl = new URL(thumbnail.src);

            thumbnailUrl.searchParams.set("p", Date.now().toFixed(0));

            setPosterUrl(thumbnailUrl.toString());
          }
        }, posterLiveUpdate);
        return () => clearInterval(interval);
      }
    }, [posterLiveUpdate, live, thumbnail, playing]);

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

    const [source, setSource] = useState<Src | null>(null);

    useEffect(() => {
      if (currentSource?.type === "hls" && !isHlsSupported) {
        setSource({
          ...currentSource,
          type: "video",
        } as const);
      } else {
        setSource(currentSource);
      }
    }, [currentSource, isHlsSupported]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: count errors
    React.useEffect(() => {
      if (source?.src && ref.current) {
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

          const { destroy } = createNewWHEP({
            source: source.src,
            element: ref.current,
            callbacks: {
              onConnected: () => __controlsFunctions.setLive(true),
              onError: onErrorComposed,
              onPlaybackOffsetUpdated:
                __controlsFunctions.updatePlaybackOffsetMs,
              onRedirect: __controlsFunctions.onFinalUrl,
            },
            accessControl: {
              jwt: __initialProps.jwt,
              accessKey: __initialProps.accessKey,
            },
            sdpTimeout: null,
          });

          const id = setTimeout(
            () => {
              if (context.store.getState().loading) {
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

        if (currentSource?.type === "video") {
          __controlsFunctions.onFinalUrl(source.src);

          ref.current.src = source.src;

          ref.current.load();

          return () => {
            unmounted = true;
          };
        }
      }
    }, [source, retryCount]);

    const onVideoError: React.ReactEventHandler<HTMLVideoElement> =
      React.useCallback(
        async (e) => {
          if (source?.type === "video") {
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

    console.log({ source });

    return (
      <Radix.Primitive.video
        src={source?.type === "video" ? source.src : undefined}
        autoPlay={Boolean(__initialProps.autoPlay)}
        loop={Boolean(__initialProps.loop)}
        playsInline
        muted={__initialProps.volume === 0}
        poster={!disablePoster && posterUrl ? posterUrl : undefined}
        {...videoProps}
        onError={composeEventHandlers(props.onError, onVideoError)}
        ref={composedRefs}
        data-livepeer-video=""
        data-livepeer-source-type={source?.type ?? "none"}
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

Video.displayName = VIDEO_NAME;

export { Video };
export type { VideoProps };
