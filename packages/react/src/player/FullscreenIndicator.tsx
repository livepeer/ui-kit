"use client";

import React from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

const FULLSCREEN_INDICATOR_NAME = "FullscreenIndicator";

type FullscreenIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface FullscreenIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
  /** The matcher used to determine whether the element should be shown, given the fullscreen state. Defaults to `true`. */
  matcher?: boolean;
}

const FullscreenIndicator = React.forwardRef<
  FullscreenIndicatorElement,
  FullscreenIndicatorProps
>((props: PlayerScopedProps<FullscreenIndicatorProps>, forwardedRef) => {
  const {
    __scopePlayer,
    forceMount,
    matcher = true,
    ...playbackStateIndicatorProps
  } = props;

  const context = usePlayerContext(FULLSCREEN_INDICATOR_NAME, __scopePlayer);

  const fullscreen = useStore(
    context.store,
    useShallow(({ fullscreen }) => fullscreen),
  );

  return (
    <Presence present={forceMount || matcher === fullscreen}>
      <Radix.Primitive.div
        {...playbackStateIndicatorProps}
        ref={forwardedRef}
        data-livepeer-player-controls-fullscreen-indicator=""
        data-livepeer-player-controls-fullscreen-indicator-present={String(
          matcher === fullscreen,
        )}
        data-livepeer-playback-state={Boolean(fullscreen)}
      />
    </Presence>
  );
});

export { FullscreenIndicator };
export type { FullscreenIndicatorProps };
