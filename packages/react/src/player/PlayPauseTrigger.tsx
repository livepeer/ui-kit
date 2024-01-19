"use client";

import { composeEventHandlers } from "@radix-ui/primitive";

import React from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

const PLAY_PAUSE_TRIGGER_NAME = "PlayPauseTrigger";

type PlayPauseTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface PlayPauseTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const PlayPauseTrigger = React.forwardRef<
  PlayPauseTriggerElement,
  PlayPauseTriggerProps
>((props: PlayerScopedProps<PlayPauseTriggerProps>, forwardedRef) => {
  const { __scopePlayer, ...playProps } = props;

  const context = usePlayerContext(PLAY_PAUSE_TRIGGER_NAME, __scopePlayer);

  const { playbackState, togglePlay } = useStore(
    context.store,
    useShallow(({ playbackState, __controlsFunctions }) => ({
      playbackState,
      togglePlay: __controlsFunctions.togglePlay,
    })),
  );

  const togglePlayComposed = React.useCallback(
    () => togglePlay(),
    [togglePlay],
  );

  const title = React.useMemo(
    () => (playbackState === "paused" ? "Pause (k)" : "Play (k)"),
    [playbackState],
  );

  return (
    <Radix.Primitive.button
      type="button"
      aria-pressed={playbackState !== "paused"}
      aria-label={title}
      title={title}
      {...playProps}
      onClick={composeEventHandlers(props.onClick, togglePlayComposed)}
      ref={forwardedRef}
      data-livepeer-player-controls-play-button=""
      data-playing={String(playbackState !== "paused")}
    />
  );
});

export { PlayPauseTrigger };
export type { PlayPauseTriggerProps };
