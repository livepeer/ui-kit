"use client";

import { Presence } from "@radix-ui/react-presence";

import React, { useCallback, useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import * as Radix from "./primitive";
import { useShallow } from "zustand/react/shallow";
import { composeEventHandlers } from "@radix-ui/primitive";
import { noPropagate } from "./shared";

const CONTROLS_NAME = "Controls";

type ControlsElement = React.ElementRef<typeof Radix.Primitive.div>;

interface ControlsProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const Controls = React.forwardRef<ControlsElement, ControlsProps>(
  (props: PlayerScopedProps<ControlsProps>, forwardedRef) => {
    const { forceMount, __scopePlayer, onClick, style, ...controlsProps } =
      props;

    const context = usePlayerContext(CONTROLS_NAME, __scopePlayer);

    const { hidden, loading, togglePlay } = useStore(
      context.store,
      useShallow(({ hidden, loading, __controlsFunctions }) => ({
        hidden,
        loading,
        togglePlay: __controlsFunctions.togglePlay,
      })),
    );

    const shown = useMemo(() => !hidden && !loading, [hidden, loading]);

    return (
      <Presence present={forceMount || shown}>
        <Radix.Primitive.div
          {...controlsProps}
          ref={forwardedRef}
          data-livepeer-player-controls-gradient=""
          data-visible={String(shown)}
          onClick={composeEventHandlers(onClick, noPropagate(togglePlay))}
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

Controls.displayName = CONTROLS_NAME;

export { Controls };
export type { ControlsProps };
