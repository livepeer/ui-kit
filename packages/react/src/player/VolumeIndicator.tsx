"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

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
  const { __scopePlayer, forceMount, matcher, ...playbackStateIndicatorProps } =
    props;

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
        {...playbackStateIndicatorProps}
        ref={forwardedRef}
        data-livepeer-player-controls-volume-indicator=""
        data-livepeer-player-controls-volume-indicator-present={String(
          isPresent,
        )}
        data-livepeer-muted={String(volume === 0)}
        data-livepeer-volume={String(volume.toFixed(2))}
      />
    </Presence>
  );
});

export { VolumeIndicator };
export type { VolumeIndicatorProps };
