"use client";

import React, { useEffect, useState } from "react";
import { useStore } from "zustand";

import { addEventListeners } from "@livepeer/core-web/browser";
import { createNewWHIP } from "@livepeer/core-web/webrtc";
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
  > {
  /**
   * Whether the element should request permissions for the video/audio
   * input from the user. This defaults to `true`, which means on component mount,
   * the user will receive a permissions request asking for access to their microphone
   * and camera.
   *
   * This can be used as a controlled input to determine when this request should be made,
   * and toggled on after mount.
   */
  enableUserMedia?: boolean;
}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: MediaScopedProps<BroadcastScopedProps<VideoProps>>, forwardedRef) => {
    const {
      __scopeMedia,
      __scopeBroadcast,
      style,
      muted = true,
      enableUserMedia = true,
      ...broadcastProps
    } = props;

    const context = useMediaContext(VIDEO_NAME, __scopeMedia);
    const broadcastContext = useBroadcastContext(VIDEO_NAME, __scopeBroadcast);

    const ref = React.useRef<VideoElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const { error, errorCount } = useStore(
      context.store,
      useShallow(({ error, errorCount }) => ({
        error,
        errorCount,
      })),
    );

    const isEnabled = useStore(
      broadcastContext.store,
      ({ enabled }) => enabled,
    );

    const { streamKey, ingestUrl } = useStore(
      broadcastContext.store,
      useShallow(({ __initialProps }) => ({
        streamKey: __initialProps.streamKey,
        ingestUrl: __initialProps.ingestUrl,
      })),
    );

    const mediaStream = useStore(
      broadcastContext.store,
      ({ mediaStream }) => mediaStream,
    );

    useEffect(() => {
      if (ref.current) {
        const { destroy } = addEventListeners(ref.current, context.store);

        return destroy;
      }
    }, [context?.store]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: context
    useEffect(() => {
      if (ref.current) {
        const { destroy } = addBroadcastEventListeners(
          ref.current,
          broadcastContext.store,
          context.store,
        );

        return destroy;
      }
    }, []);

    const [retryCount, setRetryCount] = useState(0);

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
      if (ref.current && enableUserMedia) {
        broadcastContext.store
          .getState()
          .__controlsFunctions.requestUserMedia();
      }
    }, [enableUserMedia]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: count errors
    React.useEffect(() => {
      if (enableUserMedia && isEnabled && streamKey && ref.current) {
        const unmounted = false;

        const onErrorComposed = (err: Error) => {
          if (!unmounted) {
            context.store.getState().__controlsFunctions?.onError?.(err);
          }
        };

        const { destroy } = createNewWHIP({
          ingestUrl: `${ingestUrl}/${streamKey}`,
          element: ref.current,
          aspectRatio: context.store.getState().__initialProps.aspectRatio,
          callbacks: {
            onConnected: (payload) => {
              broadcastContext.store
                .getState()
                .__controlsFunctions.updateMediaStream(payload.stream);
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

              context.store.getState().__controlsFunctions.setLive(true);
            },
            onError: onErrorComposed,
          },
          sdpTimeout: null,
        });

        return () => {
          destroy?.();
        };
      }
    }, [streamKey, ingestUrl, retryCount, enableUserMedia, isEnabled]);

    const onVideoError: React.ReactEventHandler<HTMLVideoElement> =
      // biome-ignore lint/correctness/useExhaustiveDependencies: context
      React.useCallback(async (_e) => {
        return context.store
          .getState()
          .__controlsFunctions?.onError?.(
            new Error("Unknown error loading video"),
          );
      }, []);

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
