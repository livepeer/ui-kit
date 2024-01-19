"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as Radix from "./primitive";

import React, { useMemo } from "react";

import { ClipLength } from "@livepeer/core-react";
import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { PlayerScopedProps, usePlayerContext } from "../context";

const CLIP_TRIGGER_NAME = "ClipTrigger";

type ClipTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface ClipTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  forceMount?: boolean;
  /** The clip length when the clip button is clicked, in seconds. Defaults to 10s. */
  clipLength?: ClipLength | null;

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
    const {
      __scopePlayer,
      style,
      clipLength = 10,
      onClip,
      forceMount,
      ...clipTriggerProps
    } = props;

    const context = usePlayerContext(CLIP_TRIGGER_NAME, __scopePlayer);

    const { playbackOffsetMs, playbackId } = useStore(
      context.store,
      useShallow(({ __controls }) => ({
        playbackOffsetMs: __controls.playbackOffsetMs,
        playbackId: __controls.playbackId,
      })),
    );

    const requestClip = React.useCallback(async () => {
      const currentTime = Date.now();

      // we get the estimated time on the server that the user "clipped"
      // by subtracting the offset from the recorded clip time
      const estimatedServerClipTime = currentTime - (playbackOffsetMs ?? 0);
      const startTime = estimatedServerClipTime - clipLength * 1000;
      const endTime = estimatedServerClipTime;

      await onClip({ playbackId, startTime, endTime });
    }, [playbackOffsetMs, clipLength, onClip, playbackId]);

    const title = useMemo(
      () =>
        clipLength
          ? `Clip last ${Number(clipLength).toFixed(0)} seconds (x)`
          : undefined,
      [clipLength],
    );

    return (
      <Presence present={forceMount || Boolean(clipLength)}>
        <Radix.Primitive.button
          type="button"
          aria-label={title}
          title={title}
          disabled={!playbackId || !playbackOffsetMs}
          {...clipTriggerProps}
          onClick={composeEventHandlers(props.onClick, requestClip)}
          ref={forwardedRef}
          data-livepeer-player-controls-clip-button=""
        />
      </Presence>
    );
  },
);

export { ClipTrigger };
export type { ClipTriggerProps };
