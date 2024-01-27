"use client";

import { Presence } from "@radix-ui/react-presence";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { BroadcastScopedProps, useBroadcastContext } from "./context";

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

    const { enabled, isWebRTCSupported } = useStore(
      broadcastContext.store,
      useShallow(({ enabled, __device }) => ({
        enabled,
        isWebRTCSupported: __device.isMediaDevicesSupported,
      })),
    );

    const shown = useMemo(
      () => !hidden && !loading && !error && enabled && isWebRTCSupported,
      [hidden, loading, error, enabled, isWebRTCSupported],
    );

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
