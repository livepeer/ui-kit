"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import { PlaybackState } from "@livepeer/core-react";
import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

const PLAYBACK_STATE_NAME = "PlaybackStateIndicator";

type PlaybackStateIndicatorElement = React.ElementRef<
  typeof Radix.Primitive.div
>;

interface PlaybackStateIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
  /** The matcher used to determine whether the element should be shown, given the playback state. */
  matcher: "not-playing" | PlaybackState | ((state: PlaybackState) => boolean);
}

const PlaybackStateIndicator = React.forwardRef<
  PlaybackStateIndicatorElement,
  PlaybackStateIndicatorProps
>((props: PlayerScopedProps<PlaybackStateIndicatorProps>, forwardedRef) => {
  const { __scopePlayer, forceMount, matcher, ...playbackStateIndicatorProps } =
    props;

  const context = usePlayerContext(PLAYBACK_STATE_NAME, __scopePlayer);

  const playbackState = useStore(
    context.store,
    useShallow(({ playbackState }) => playbackState),
  );

  const isPresent = useMemo(
    () =>
      typeof matcher === "string"
        ? matcher === "not-playing"
          ? playbackState !== "playing"
          : matcher === playbackState
        : matcher(playbackState),
    [playbackState, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...playbackStateIndicatorProps}
        ref={forwardedRef}
        data-livepeer-player-controls-playback-state-indicator=""
        data-livepeer-player-controls-playback-state-indicator-present={String(
          isPresent,
        )}
        data-livepeer-playback-state={playbackState}
      />
    </Presence>
  );
});

export { PlaybackStateIndicator };
export type { PlaybackStateIndicatorProps };
