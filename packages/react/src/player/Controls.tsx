"use client";

import { Presence } from "@radix-ui/react-presence";

import React, { useCallback } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import * as Radix from "./primitive";
import { useShallow } from "zustand/react/shallow";

const CONTROLS_NAME = "Controls";

type ControlsElement = React.ElementRef<typeof Radix.Primitive.div>;

interface ControlsProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /** Whether the gradient should be shown behind the controls. Defaults to `true`. */
  gradient?: boolean;
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const Controls = React.forwardRef<ControlsElement, ControlsProps>(
  (props: PlayerScopedProps<ControlsProps>, forwardedRef) => {
    const {
      gradient = true,
      forceMount,
      __scopePlayer,
      style,
      ...controlsProps
    } = props;

    const context = usePlayerContext(CONTROLS_NAME, __scopePlayer);

    const { hidden, playbackState, togglePlay, error } = useStore(
      context.store,
      useShallow(({ hidden, playbackState, __controlsFunctions, error }) => ({
        hidden,
        playbackState,
        togglePlay: __controlsFunctions.togglePlay,
        error,
      })),
    );

    const togglePlayComposed = useCallback(() => togglePlay(), [togglePlay]);

    return (
      <Presence
        present={forceMount || (!hidden && playbackState !== "loading")}
      >
        <Radix.Primitive.div
          {...controlsProps}
          ref={forwardedRef}
          data-livepeer-player-controls-gradient=""
          data-visible={gradient ? !hidden : false}
          // onClick={composeEventHandlers(props.onClick, togglePlay)}
          style={{
            ...style,
            // ensures controls expands in ratio
            position: "absolute",

            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
      </Presence>
    );
  },
);

export { Controls };
export type { ControlsProps };
