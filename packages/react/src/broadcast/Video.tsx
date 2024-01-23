"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "zustand";

import { addEventListeners } from "@livepeer/core-web/browser";
import {
  attachUserMediaToElement,
  createNewWHIP,
} from "@livepeer/core-web/webrtc";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { MediaScopedProps, useMediaContext } from "../context";

import { addBroadcastEventListeners } from "@livepeer/core-web/broadcast";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { BroadcastScopedProps, useBroadcastContext } from "./context";

const VIDEO_NAME = "Video";

type OmittedProps = "src" | "poster";

type VideoElement = React.ElementRef<typeof Radix.Primitive.video>;

interface VideoProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.video>,
    OmittedProps
  > {}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: MediaScopedProps<BroadcastScopedProps<VideoProps>>, forwardedRef) => {
    const {
      __scopeMedia,
      __scopeBroadcast,
      style,
      muted = true,
      ...broadcastProps
    } = props;

    const context = useMediaContext(VIDEO_NAME, __scopeMedia);
    const broadcastContext = useBroadcastContext(VIDEO_NAME, __scopeBroadcast);

    const ref = React.useRef<VideoElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const { error, errorCount, __controlsFunctions, __initialProps } = useStore(
      context.store,
      useShallow(
        ({ __initialProps, __controlsFunctions, error, errorCount }) => ({
          error,
          errorCount,
          __controlsFunctions,
          __initialProps,
        }),
      ),
    );

    const enabled = useStore(broadcastContext.store, ({ enabled }) => enabled);

    const broadcast = useStore(
      broadcastContext.store,
      useShallow(({ __initialProps }) => ({
        streamKey: __initialProps.streamKey,
        ingestUrl: __initialProps.ingestUrl,
      })),
    );

    useEffect(() => {
      if (ref.current) {
        const { destroy } = addEventListeners(ref.current, context.store);

        return destroy;
      }
    }, [context?.store]);

    useEffect(() => {
      if (ref.current) {
        const { destroy } = addBroadcastEventListeners(
          ref.current,
          broadcastContext.store,
        );

        return destroy;
      }
    }, [broadcastContext?.store]);

    const [retryCount, setRetryCount] = useState(0);

    console.log({ error });

    // biome-ignore lint/correctness/useExhaustiveDependencies: error count
    useEffect(() => {
      if (error) {
        const timeout = setTimeout(
          () => setRetryCount((retries) => retries + 1),
          errorCount * 2000,
        );
        return () => clearTimeout(timeout);
      }
    }, [errorCount]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: context
    React.useEffect(() => {
      if (ref.current) {
        const unmounted = false;

        const onErrorComposed = (err: Error) => {
          if (!unmounted) {
            __controlsFunctions?.onError?.(err);
          }
        };

        // const onConnected = () => {
        //   // _updateMediaStream(payload.stream, {
        //   //   audio:
        //   //     payload?.audioTransceiver?.sender?.track?.getSettings()?.deviceId,
        //   //   video:
        //   //     payload?.videoTransceiver?.sender?.track?.getSettings()?.deviceId,
        //   // });
        //   // setTransceivers({
        //   //   audio: payload.audioTransceiver,
        //   //   video: payload.videoTransceiver,
        //   // });
        //   context.store.getState().__controlsFunctions.togglePlay?.(true);
        //   context.store.getState().__controlsFunctions.setLive(true);
        // };

        attachUserMediaToElement({
          element: ref.current,
          source: {},
          callbacks: {
            onError: onErrorComposed,
            onMedia(stream) {
              console.log(stream);
              context.store.getState().__controlsFunctions.togglePlay?.(true);
              context.store.getState().__controlsFunctions.setLive(false);
            },
          },
        });

        return () => {};
      }
    }, [__controlsFunctions?.onError, enabled]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: count errors
    React.useEffect(() => {
      if (enabled && broadcast?.streamKey && ref.current) {
        const unmounted = false;

        const onErrorComposed = (err: Error) => {
          if (!unmounted) {
            __controlsFunctions?.onError?.(err);
          }
        };

        const onConnected = () => {
          // _updateMediaStream(payload.stream, {
          //   audio:
          //     payload?.audioTransceiver?.sender?.track?.getSettings()?.deviceId,
          //   video:
          //     payload?.videoTransceiver?.sender?.track?.getSettings()?.deviceId,
          // });
          // setTransceivers({
          //   audio: payload.audioTransceiver,
          //   video: payload.videoTransceiver,
          // });
          context.store.getState().__controlsFunctions.togglePlay?.(true);
          context.store.getState().__controlsFunctions.setLive(true);
        };

        const { destroy } = createNewWHIP({
          ingestUrl: `${broadcast.ingestUrl}/${broadcast.streamKey}`,
          element: ref.current,
          aspectRatio: context.store.getState().__initialProps.aspectRatio,
          callbacks: {
            onConnected,
            onError: onErrorComposed,
          },
          sdpTimeout: null,
        });

        return () => {
          destroy?.();
        };
      }
    }, [broadcast, retryCount, enabled]);

    const onVideoError: React.ReactEventHandler<HTMLVideoElement> =
      React.useCallback(
        async (_e) => {
          return __controlsFunctions?.onError?.(
            new Error("Unknown error loading video"),
          );
        },
        [__controlsFunctions?.onError],
      );

    return (
      <Radix.Primitive.video
        playsInline
        muted={muted}
        {...broadcastProps}
        onError={composeEventHandlers(props.onError, onVideoError)}
        ref={composedRefs}
        data-livepeer-video=""
        // data-livepeer-source-type={source?.type ?? "none"}
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
