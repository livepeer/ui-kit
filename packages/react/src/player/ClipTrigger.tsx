"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as Radix from "../shared/primitive";

import React, { useEffect } from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { type MediaScopedProps, useMediaContext } from "../shared/context";
import { noPropagate } from "../shared/utils";

const CLIP_TRIGGER_NAME = "ClipTrigger";

type ClipTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface ClipTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;

  onClip: (opts: {
    /**
     * Playback ID of the stream or asset to clip
     */
    playbackId: string;
    /**
     * Start time of the clip in milliseconds
     */
    startTime: number;
    /**
     * End time of the clip in milliseconds
     */
    endTime: number;
  }) => Promise<void> | void;
}

const ClipTrigger = React.forwardRef<ClipTriggerElement, ClipTriggerProps>(
  (props: MediaScopedProps<ClipTriggerProps>, forwardedRef) => {
    const { __scopeMedia, forceMount, onClip, ...clipTriggerProps } = props;

    const context = useMediaContext(CLIP_TRIGGER_NAME, __scopeMedia);

    const { clipLength, requestClip, playbackId, title } = useStore(
      context.store,
      useShallow(
        ({ __controls, __controlsFunctions, aria, __initialProps }) => ({
          requestClip: __controlsFunctions.requestClip,
          playbackId: __controls.playbackId,
          clipLength: __initialProps.clipLength,
          title: aria.clip,
        }),
      ),
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: no dependencies
    useEffect(() => {
      if (playbackId) {
        return context.store.subscribe(
          (state) => state.__controls.requestedClipParams,
          (params) => {
            if (params) {
              onClip({ playbackId, ...params });
            }
          },
        );
      }
    }, [playbackId]);

    return (
      <Presence present={forceMount || Boolean(clipLength)}>
        <Radix.Primitive.button
          type="button"
          aria-label={title ?? undefined}
          title={title ?? undefined}
          disabled={!playbackId || !requestClip}
          {...clipTriggerProps}
          onClick={composeEventHandlers(
            props.onClick,
            noPropagate(requestClip),
          )}
          ref={forwardedRef}
          data-livepeer-controls-clip-button=""
          data-visible={String(Boolean(clipLength))}
        />
      </Presence>
    );
  },
);

ClipTrigger.displayName = CLIP_TRIGGER_NAME;

export { ClipTrigger };
export type { ClipTriggerProps };
