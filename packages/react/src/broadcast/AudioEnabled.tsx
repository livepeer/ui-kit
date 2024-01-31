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
 * AudioEnabledTrigger
 */

const AUDIO_ENABLED_TRIGGER_NAME = "AudioEnabledTrigger";

type AudioEnabledTriggerElement = React.ElementRef<
  typeof Radix.Primitive.button
>;

interface AudioEnabledTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const AudioEnabledTrigger = React.forwardRef<
  AudioEnabledTriggerElement,
  AudioEnabledTriggerProps
>((props: BroadcastScopedProps<AudioEnabledTriggerProps>, forwardedRef) => {
  const { __scopeBroadcast, ...audioEnabledProps } = props;

  const broadcastContext = useBroadcastContext(
    AUDIO_ENABLED_TRIGGER_NAME,
    __scopeBroadcast,
  );

  const { audio, title, toggleAudio } = useStore(
    broadcastContext.store,
    useShallow(({ audio, aria, __controlsFunctions }) => ({
      audio,
      title: aria.audioTrigger,
      toggleAudio: __controlsFunctions.toggleAudio,
    })),
  );

  return (
    <Radix.Primitive.button
      type="button"
      aria-pressed={audio}
      aria-label={title}
      title={title}
      {...audioEnabledProps}
      onClick={composeEventHandlers(props.onClick, noPropagate(toggleAudio))}
      ref={forwardedRef}
      data-livepeer-controls-audio-enabled-trigger=""
      data-enabled={String(audio)}
    />
  );
});

AudioEnabledTrigger.displayName = AUDIO_ENABLED_TRIGGER_NAME;

/**
 * AudioEnabledIndicator
 */

const AUDIO_ENABLED_INDICATOR_NAME = "AudioEnabledIndicator";

type AudioEnabledIndicatorElement = React.ElementRef<
  typeof Radix.Primitive.div
>;

interface AudioEnabledIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /**
   * The matcher used to determine whether the element should be shown, given the `audio` state.
   * Defaults to `true`, which means "shown when broadcast audio is enabled".
   */
  matcher?: boolean | ((state: boolean) => boolean);
}

const AudioEnabledIndicator = React.forwardRef<
  AudioEnabledIndicatorElement,
  AudioEnabledIndicatorProps
>((props: BroadcastScopedProps<AudioEnabledIndicatorProps>, forwardedRef) => {
  const {
    __scopeBroadcast,
    forceMount,
    matcher = true,
    ...audioIndicatorProps
  } = props;

  const broadcastContext = useBroadcastContext(
    AUDIO_ENABLED_INDICATOR_NAME,
    __scopeBroadcast,
  );

  const audio = useStore(broadcastContext.store, ({ audio }) => audio);

  const isPresent = useMemo(
    () => (typeof matcher === "boolean" ? matcher === audio : matcher(audio)),
    [audio, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...audioIndicatorProps}
        ref={forwardedRef}
        data-livepeer-controls-audio-enabled-indicator=""
        data-enabled={String(audio)}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

AudioEnabledIndicator.displayName = AUDIO_ENABLED_INDICATOR_NAME;

export { AudioEnabledIndicator, AudioEnabledTrigger };
export type { AudioEnabledIndicatorProps, AudioEnabledTriggerProps };
