"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as SliderPrimitive from "./Slider";

import React from "react";

import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { PlayerScopedProps, usePlayerContext } from "../context";

import * as Radix from "./primitive";

const VOLUME_TRIGGER_NAME = "Volume";

type VolumeElement = React.ElementRef<typeof Radix.Primitive.button>;

interface VolumeProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const Volume = React.forwardRef<VolumeElement, VolumeProps>(
  (props: PlayerScopedProps<VolumeProps>, forwardedRef) => {
    const { __scopePlayer, ...volumeProps } = props;

    const context = usePlayerContext(VOLUME_TRIGGER_NAME, __scopePlayer);

    const { volume, requestVolume } = useStore(
      context.store,
      useShallow(({ volume, __controlsFunctions }) => ({
        volume,
        requestVolume: __controlsFunctions.requestVolume,
      })),
    );

    const onValueChange = React.useCallback(
      ([value]: number[]) => requestVolume(value),
      [requestVolume],
    );
    const onValueCommit = React.useCallback(
      ([value]: number[]) => requestVolume(value),
      [requestVolume],
    );

    return (
      <SliderPrimitive.Root
        aria-label="Volume Slider"
        // aria-valuetext={title}
        step={0.01}
        max={1}
        value={[volume]}
        {...volumeProps}
        onValueChange={composeEventHandlers(props.onValueChange, onValueChange)}
        onValueCommit={composeEventHandlers(props.onValueCommit, onValueCommit)}
        ref={forwardedRef}
        data-livepeer-player-controls-volume=""
        data-muted={String(volume === 0)}
      />
    );
  },
);

export { Volume };
export type { VolumeProps };
