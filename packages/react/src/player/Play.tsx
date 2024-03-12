"use client";

import { composeEventHandlers } from "@radix-ui/primitive";

import React, { useMemo } from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { type MediaScopedProps, useMediaContext } from "../shared/context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { noPropagate } from "../shared/utils";

/**
 * PlayPauseTrigger
 */

const PLAY_PAUSE_TRIGGER_NAME = "PlayPauseTrigger";

type PlayPauseTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface PlayPauseTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const PlayPauseTrigger = React.forwardRef<
  PlayPauseTriggerElement,
  PlayPauseTriggerProps
>((props: MediaScopedProps<PlayPauseTriggerProps>, forwardedRef) => {
  const { __scopeMedia, ...playProps } = props;

  const context = useMediaContext(PLAY_PAUSE_TRIGGER_NAME, __scopeMedia);

  const { playing, togglePlay, title } = useStore(
    context.store,
    useShallow(({ playing, __controlsFunctions, aria }) => ({
      playing,
      togglePlay: __controlsFunctions.togglePlay,
      title: aria.playPause,
    })),
  );

  return (
    <Radix.Primitive.button
      type="button"
      aria-pressed={playing}
      aria-label={title ?? undefined}
      title={title ?? undefined}
      {...playProps}
      onClick={composeEventHandlers(props.onClick, noPropagate(togglePlay))}
      ref={forwardedRef}
      data-livepeer-controls-play-pause-trigger=""
      data-playing={String(playing)}
    />
  );
});

PlayPauseTrigger.displayName = PLAY_PAUSE_TRIGGER_NAME;

/**
 * PlayingIndicator
 */

const PLAYING_INDICATOR_NAME = "PlayingIndicator";

type PlayingIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface PlayingIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /** The matcher used to determine whether the element should be shown, given the playing state. Defaults to `true`, which equals playing. */
  matcher?: boolean | ((state: boolean) => boolean);
}

const PlayingIndicator = React.forwardRef<
  PlayingIndicatorElement,
  PlayingIndicatorProps
>((props: MediaScopedProps<PlayingIndicatorProps>, forwardedRef) => {
  const {
    __scopeMedia,
    forceMount,
    matcher = true,
    ...playPauseIndicatorProps
  } = props;

  const context = useMediaContext(PLAYING_INDICATOR_NAME, __scopeMedia);

  const playing = useStore(
    context.store,
    useShallow(({ playing }) => playing),
  );

  const isPresent = useMemo(
    () =>
      typeof matcher === "boolean" ? matcher === playing : matcher(playing),
    [playing, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...playPauseIndicatorProps}
        ref={forwardedRef}
        data-livepeer-controls-play-pause-indicator=""
        data-playing={String(playing)}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

PlayingIndicator.displayName = PLAYING_INDICATOR_NAME;

export { PlayPauseTrigger, PlayingIndicator };
export type { PlayPauseTriggerProps, PlayingIndicatorProps };
