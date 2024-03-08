"use client";

import React, { useEffect, useMemo } from "react";

import { useStore } from "zustand";
import { type MediaScopedProps, useMediaContext } from "../shared/context";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as SliderPrimitive from "../shared/Slider";

import { warn } from "@livepeer/core/utils";
import { noPropagate } from "../shared/utils";

/**
 * Volume
 */

const VOLUME_NAME = "Volume";

type VolumeElement = React.ElementRef<typeof Radix.Primitive.button>;

interface VolumeProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const Volume = React.forwardRef<VolumeElement, VolumeProps>(
  (props: MediaScopedProps<VolumeProps>, forwardedRef) => {
    const { __scopeMedia, forceMount, ...volumeProps } = props;

    const context = useMediaContext(VOLUME_NAME, __scopeMedia);

    const { volume, requestVolume, isVolumeChangeSupported } = useStore(
      context.store,
      useShallow(({ volume, __controlsFunctions, __device }) => ({
        volume,
        requestVolume: __controlsFunctions.requestVolume,
        isVolumeChangeSupported: __device.isVolumeChangeSupported,
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
      <Presence present={forceMount || isVolumeChangeSupported}>
        <SliderPrimitive.Root
          aria-label="Volume Slider"
          step={0.01}
          max={1}
          value={[volume]}
          {...volumeProps}
          onClick={noPropagate(() => {})}
          onValueChange={composeEventHandlers(
            props.onValueChange,
            onValueChange,
          )}
          onValueCommit={composeEventHandlers(
            props.onValueCommit,
            onValueCommit,
          )}
          ref={forwardedRef}
          data-livepeer-controls-volume=""
          data-livepeer-muted={String(volume === 0)}
          data-livepeer-volume={String((100 * volume).toFixed(0))}
          data-visible={String(Boolean(isVolumeChangeSupported))}
        />
      </Presence>
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
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /** The matcher used to determine whether the element should be shown, given the volume. Defaults to match `false`, which is muted. */
  matcher?: boolean | ((volume: number) => boolean);
}

const VolumeIndicator = React.forwardRef<
  VolumeIndicatorElement,
  VolumeIndicatorProps
>((props: MediaScopedProps<VolumeIndicatorProps>, forwardedRef) => {
  const {
    __scopeMedia,
    forceMount,
    matcher = false,
    ...volumeIndicatorProps
  } = props;

  const context = useMediaContext(VOLUME_INDICATOR_NAME, __scopeMedia);

  const { volume, muted, isVolumeChangeSupported } = useStore(
    context.store,
    useShallow(({ volume, __device, __controls }) => ({
      volume,
      muted: __controls.muted,
      isVolumeChangeSupported: __device.isVolumeChangeSupported,
    })),
  );

  const isPresent = useMemo(
    () =>
      matcher !== undefined
        ? typeof matcher === "boolean"
          ? matcher
            ? !muted
            : muted
          : matcher(volume)
        : muted,
    [volume, matcher, muted],
  );

  useEffect(() => {
    if (isVolumeChangeSupported && typeof matcher !== "boolean") {
      warn("Volume change is not supported on this device.");
    }
  }, [isVolumeChangeSupported, matcher]);

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...volumeIndicatorProps}
        ref={forwardedRef}
        data-livepeer-muted={String(muted)}
        data-livepeer-volume={String((100 * volume).toFixed(0))}
        data-livepeer-controls-volume-indicator=""
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

VolumeIndicator.displayName = VOLUME_INDICATOR_NAME;

export { Volume, VolumeIndicator };
export type { VolumeIndicatorProps, VolumeProps };
