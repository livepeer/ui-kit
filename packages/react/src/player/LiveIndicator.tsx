"use client";

import React from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import * as Radix from "./primitive";

const LIVE_INDICATOR_NAME = "LiveIndicator";

type LiveIndicatorElement = React.ElementRef<typeof Radix.Primitive.button>;

interface LiveIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  forceMount?: boolean;
  /** The matcher used to determine whether the element should be shown, given the `live` state (true for live streams, and false for assets). Defaults to `true`. */
  matcher?: boolean;
}

const LiveIndicator = React.forwardRef<
  LiveIndicatorElement,
  LiveIndicatorProps
>((props: PlayerScopedProps<LiveIndicatorProps>, forwardedRef) => {
  const {
    __scopePlayer,
    forceMount,
    matcher = true,
    ...liveIndicatorProps
  } = props;

  const context = usePlayerContext(LIVE_INDICATOR_NAME, __scopePlayer);

  const live = useStore(context.store, ({ live }) => live);

  return (
    <Presence present={forceMount || live === matcher}>
      <Radix.Primitive.span
        type="button"
        aria-label="live"
        {...liveIndicatorProps}
        ref={forwardedRef}
        data-livepeer-player-controls-time=""
        date-live={String(live)}
      />
    </Presence>
  );
});

export { LiveIndicator };
export type { LiveIndicatorProps };
