"use client";

import type * as Radix from "@radix-ui/react-primitive";

import React from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";

const LIVE_INDICATOR_NAME = "LiveIndicator";

type LiveIndicatorElement = React.ElementRef<typeof Primitive.button>;

interface LiveIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.button> {
  forceMount?: boolean;
}

const LiveIndicator = React.forwardRef<
  LiveIndicatorElement,
  LiveIndicatorProps
>((props: PlayerScopedProps<LiveIndicatorProps>, forwardedRef) => {
  const { __scopePlayer, forceMount, ...liveIndicatorProps } = props;

  const context = usePlayerContext(LIVE_INDICATOR_NAME, __scopePlayer);

  const { live } = useStore(context.store, ({ live }) => ({
    live,
  }));

  return (
    <Presence present={forceMount || live}>
      <Primitive.span
        type="button"
        aria-label="live"
        {...liveIndicatorProps}
        ref={forwardedRef}
        data-livepeer-player-controls-time=""
        date-live={live}
      />
    </Presence>
  );
});

export { LiveIndicator };
export type { LiveIndicatorProps };
