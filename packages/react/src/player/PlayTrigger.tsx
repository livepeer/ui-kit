"use client";

import type * as Radix from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import React, { useEffect } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";

const PLAY_TRIGGER_NAME = "PlayTrigger";

type PlayTriggerElement = React.ElementRef<typeof Primitive.button>;

interface PlayTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.button> {
  playing?: boolean;
  disabled?: boolean;
  onPlayingChange?(playing: boolean): void;
}

const PlayTrigger = React.forwardRef<PlayTriggerElement, PlayTriggerProps>(
  (props: PlayerScopedProps<PlayTriggerProps>, forwardedRef) => {
    const {
      __scopePlayer,
      playing: playingProp,
      disabled,
      onPlayingChange,
      ...playProps
    } = props;

    const context = usePlayerContext(PLAY_TRIGGER_NAME, __scopePlayer);

    const { playbackState, __controlsFunctions, __initialProps } = useStore(
      context.store,
      ({ playbackState, __controlsFunctions, __initialProps }) => ({
        playbackState,
        __controlsFunctions,
        __initialProps,
      }),
    );

    const [playing = false, setPlaying] = useControllableState({
      prop: playingProp,
      defaultProp: __initialProps.autoPlay,
      onChange: onPlayingChange,
    });

    useEffect(() => {
      setPlaying(playbackState === "playing");
    }, [setPlaying, playbackState]);

    console.log({ playbackState });

    const togglePlay = React.useCallback(
      () => __controlsFunctions.togglePlay(),
      [__controlsFunctions],
    );

    const title = React.useMemo(
      () => (playing ? "Pause (k)" : "Play (k)"),
      [playing],
    );

    return (
      <Primitive.button
        type="button"
        aria-pressed={playing}
        aria-label={title}
        title={title}
        {...playProps}
        onClick={composeEventHandlers(props.onClick, togglePlay)}
        ref={forwardedRef}
        data-livepeer-player-controls-play-button=""
        data-playing={playing}
      />
    );
  },
);

export { PlayTrigger };
export type { PlayTriggerProps };
