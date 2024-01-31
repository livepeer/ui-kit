"use client";

import React, { useEffect } from "react";
import { useStore } from "zustand";

import { addEventListeners } from "@livepeer/core-web/browser";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { MediaScopedProps, useMediaContext } from "../context";

import { addBroadcastEventListeners } from "@livepeer/core-web/broadcast";
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

    const isEnabled = useStore(
      broadcastContext.store,
      ({ enabled }) => enabled,
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: context
    React.useEffect(() => {
      context.store.getState().__controlsFunctions.setMounted();
    }, []);

    return (
      <Radix.Primitive.video
        playsInline
        muted={muted}
        {...broadcastProps}
        ref={composedRefs}
        data-livepeer-video=""
        data-enabled={Boolean(isEnabled)}
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
