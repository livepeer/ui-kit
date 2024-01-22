"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as SliderPrimitive from "./Slider";

import { noPropagate } from "./shared";

/**
 * Volume
 */

const VOLUME_NAME = "Volume";

type VolumeElement = React.ElementRef<typeof Radix.Primitive.button>;

interface VolumeProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const Volume = React.forwardRef<VolumeElement, VolumeProps>(
  (props: PlayerScopedProps<VolumeProps>, forwardedRef) => {
    const { __scopePlayer, ...volumeProps } = props;

    const context = usePlayerContext(VOLUME_NAME, __scopePlayer);

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
        onClick={noPropagate(() => {})}
        onValueChange={composeEventHandlers(props.onValueChange, onValueChange)}
        onValueCommit={composeEventHandlers(props.onValueCommit, onValueCommit)}
        ref={forwardedRef}
        data-livepeer-player-controls-volume=""
        data-livepeer-muted={String(volume === 0)}
        data-livepeer-volume={String((100 * volume).toFixed(0))}
      />
    );
  },
);

Volume.displayName = VOLUME_NAME;

/**
 * VolumeIndicator
 */

const VOLUME_INDICATOR_NAME = "VolumeIndicator";

type VolumeIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface VolumeIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
  /** The matcher used to determine whether the element should be shown, given the volume. Defaults to match `false`, which is muted. */
  matcher?: boolean | ((volume: number) => boolean);
}

const VolumeIndicator = React.forwardRef<
  VolumeIndicatorElement,
  VolumeIndicatorProps
>((props: PlayerScopedProps<VolumeIndicatorProps>, forwardedRef) => {
  const {
    __scopePlayer,
    forceMount,
    matcher = false,
    ...volumeIndicatorProps
  } = props;

  const context = usePlayerContext(VOLUME_INDICATOR_NAME, __scopePlayer);

  const volume = useStore(
    context.store,
    useShallow(({ volume }) => volume),
  );

  const isPresent = useMemo(
    () =>
      matcher !== undefined
        ? typeof matcher === "boolean"
          ? matcher
            ? volume !== 0
            : volume === 0
          : matcher(volume)
        : volume === 0,
    [volume, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...volumeIndicatorProps}
        ref={forwardedRef}
        data-livepeer-muted={String(volume === 0)}
        data-livepeer-volume={String((100 * volume).toFixed(0))}
        data-livepeer-player-controls-volume-indicator=""
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

VolumeIndicator.displayName = VOLUME_INDICATOR_NAME;

export { Volume, VolumeIndicator };
export type { VolumeIndicatorProps, VolumeProps };
