"use client";

import { Presence } from "@radix-ui/react-presence";

import React, { useEffect, useMemo } from "react";

import { useStore } from "zustand";

import { composeEventHandlers } from "@radix-ui/primitive";
import { useShallow } from "zustand/react/shallow";
import { type MediaScopedProps, useMediaContext } from "../shared/context";
import * as Radix from "../shared/primitive";
import { noPropagate } from "../shared/utils";

const CONTROLS_NAME = "Controls";

type ControlsElement = React.ElementRef<typeof Radix.Primitive.div>;

interface ControlsProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;

  /**
   * Auto-hide the controls after a mouse or touch interaction (in milliseconds).
   *
   * Defaults to 3000. Set to 0 for no hiding.
   */
  autoHide?: number;
}

const Controls = React.forwardRef<ControlsElement, ControlsProps>(
  (props: MediaScopedProps<ControlsProps>, forwardedRef) => {
    const {
      forceMount,
      __scopeMedia,
      onClick,
      style,
      autoHide,
      ...controlsProps
    } = props;

    const context = useMediaContext(CONTROLS_NAME, __scopeMedia);

    const { hidden, loading, togglePlay, error } = useStore(
      context.store,
      useShallow(({ hidden, loading, __controlsFunctions, error }) => ({
        hidden,
        loading,
        togglePlay: __controlsFunctions.togglePlay,
        error: error?.type ?? null,
      })),
    );

    const shown = useMemo(
      () => !hidden && !loading && !error,
      [hidden, loading, error],
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: only set once to prevent flashing
    useEffect(() => {
      if (autoHide !== undefined) {
        context.store.getState().__controlsFunctions.setAutohide(autoHide);
      }
    }, []);

    return (
      <Presence present={forceMount || shown}>
        <Radix.Primitive.div
          {...controlsProps}
          ref={forwardedRef}
          data-livepeer-controls=""
          data-visible={String(shown)}
          onClick={composeEventHandlers(onClick, noPropagate(togglePlay))}
          style={{
            ...style,
            // ensures controls expands in ratio
            position: "absolute",
            inset: 0,
          }}
        />
      </Presence>
    );
  },
);

Controls.displayName = CONTROLS_NAME;

export { Controls };
export type { ControlsProps };
