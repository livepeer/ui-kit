"use client";

import { composeEventHandlers } from "@radix-ui/primitive";

import React, { useMemo } from "react";

import { useStore } from "zustand";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { noPropagate } from "../shared/utils";
import { BroadcastScopedProps, useBroadcastContext } from "./context";

/**
 * VideoEnabledTrigger
 */

const VIDEO_ENABLED_TRIGGER_NAME = "VideoEnabledTrigger";

type VideoEnabledTriggerElement = React.ElementRef<
  typeof Radix.Primitive.button
>;

interface VideoEnabledTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const VideoEnabledTrigger = React.forwardRef<
  VideoEnabledTriggerElement,
  VideoEnabledTriggerProps
>((props: BroadcastScopedProps<VideoEnabledTriggerProps>, forwardedRef) => {
  const { __scopeBroadcast, ...videoEnabledProps } = props;

  const broadcastContext = useBroadcastContext(
    VIDEO_ENABLED_TRIGGER_NAME,
    __scopeBroadcast,
  );

  const { video, title, toggleVideo } = useStore(
    broadcastContext.store,
    useShallow(({ video, aria, __controlsFunctions }) => ({
      video,
      title: aria.videoTrigger,
      toggleVideo: __controlsFunctions.toggleVideo,
    })),
  );

  return (
    <Radix.Primitive.button
      type="button"
      aria-pressed={video}
      aria-label={title}
      title={title}
      {...videoEnabledProps}
      onClick={composeEventHandlers(props.onClick, noPropagate(toggleVideo))}
      ref={forwardedRef}
      data-livepeer-controls-video-enabled-trigger=""
      data-enabled={String(video)}
    />
  );
});

VideoEnabledTrigger.displayName = VIDEO_ENABLED_TRIGGER_NAME;

/**
 * VideoEnabledIndicator
 */

const VIDEO_ENABLED_INDICATOR_NAME = "VideoEnabledIndicator";

type VideoEnabledIndicatorElement = React.ElementRef<
  typeof Radix.Primitive.div
>;

interface VideoEnabledIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /**
   * The matcher used to determine whether the element should be shown, given the `video` state.
   * Defaults to `true`, which means "shown when broadcast video is enabled".
   */
  matcher?: boolean | ((state: boolean) => boolean);
}

const VideoEnabledIndicator = React.forwardRef<
  VideoEnabledIndicatorElement,
  VideoEnabledIndicatorProps
>((props: BroadcastScopedProps<VideoEnabledIndicatorProps>, forwardedRef) => {
  const {
    __scopeBroadcast,
    forceMount,
    matcher = true,
    ...videoIndicatorProps
  } = props;

  const broadcastContext = useBroadcastContext(
    VIDEO_ENABLED_INDICATOR_NAME,
    __scopeBroadcast,
  );

  const video = useStore(broadcastContext.store, ({ video }) => video);

  const isPresent = useMemo(
    () => (typeof matcher === "boolean" ? matcher === video : matcher(video)),
    [video, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...videoIndicatorProps}
        ref={forwardedRef}
        data-livepeer-controls-video-enabled-indicator=""
        data-enabled={String(video)}
      />
    </Presence>
  );
});

VideoEnabledIndicator.displayName = VIDEO_ENABLED_INDICATOR_NAME;

export { VideoEnabledIndicator, VideoEnabledTrigger };
export type { VideoEnabledIndicatorProps, VideoEnabledTriggerProps };
