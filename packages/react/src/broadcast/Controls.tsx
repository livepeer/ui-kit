"use client";

import { Presence } from "@radix-ui/react-presence";

import React, { useEffect, useMemo } from "react";

import { useStore } from "zustand";

import { useShallow } from "zustand/react/shallow";
import { type MediaScopedProps, useMediaContext } from "../shared/context";
import * as Radix from "../shared/primitive";
import { type BroadcastScopedProps, useBroadcastContext } from "./context";

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
  (
    props: MediaScopedProps<BroadcastScopedProps<ControlsProps>>,
    forwardedRef,
  ) => {
    const {
      forceMount,
      __scopeMedia,
      __scopeBroadcast,
      onClick,
      style,
      autoHide,
      ...controlsProps
    } = props;

    const context = useMediaContext(CONTROLS_NAME, __scopeMedia);

    const { hidden, loading, error } = useStore(
      context.store,
      useShallow(({ hidden, loading, error }) => ({
        hidden,
        loading,
        error: error?.type ?? null,
      })),
    );

    const broadcastContext = useBroadcastContext(
      CONTROLS_NAME,
      __scopeBroadcast,
    );

    const { isWebRTCSupported } = useStore(
      broadcastContext.store,
      useShallow(({ enabled, __device }) => ({
        enabled,
        isWebRTCSupported: __device.isMediaDevicesSupported,
      })),
    );

    const shown = useMemo(
      () => !hidden && !loading && !error && isWebRTCSupported,
      [hidden, loading, error, isWebRTCSupported],
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
