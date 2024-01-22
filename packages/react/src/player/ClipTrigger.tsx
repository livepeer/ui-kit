"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as Radix from "./primitive";

import React, { useEffect } from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { noPropagate } from "./shared";

const CLIP_TRIGGER_NAME = "ClipTrigger";

type ClipTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface ClipTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  forceMount?: boolean;

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
  (props: PlayerScopedProps<ClipTriggerProps>, forwardedRef) => {
    const { __scopePlayer, style, forceMount, onClip, ...clipTriggerProps } =
      props;

    const context = usePlayerContext(CLIP_TRIGGER_NAME, __scopePlayer);

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
      return context.store.subscribe(
        (state) => state.__controls.requestedClipParams,
        (params) => {
          onClip({ playbackId, ...params });
        },
      );
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
          data-livepeer-player-controls-clip-button=""
          data-visible={String(Boolean(clipLength))}
        />
      </Presence>
    );
  },
);

ClipTrigger.displayName = CLIP_TRIGGER_NAME;

export { ClipTrigger };
export type { ClipTriggerProps };
