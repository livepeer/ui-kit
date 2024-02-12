"use client";

import React, { useMemo } from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../shared/context";
import * as Radix from "../shared/primitive";

const LIVE_INDICATOR_NAME = "LiveIndicator";

type LiveIndicatorElement = React.ElementRef<typeof Radix.Primitive.button>;

interface LiveIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /** The matcher used to determine whether the element should be shown, given the `live` state (true for live streams, and false for assets). Defaults to `true`. */
  matcher?: boolean | ((live: boolean) => boolean);
}

const LiveIndicator = React.forwardRef<
  LiveIndicatorElement,
  LiveIndicatorProps
>((props: MediaScopedProps<LiveIndicatorProps>, forwardedRef) => {
  const {
    __scopeMedia,
    forceMount,
    matcher = true,
    ...liveIndicatorProps
  } = props;

  const context = useMediaContext(LIVE_INDICATOR_NAME, __scopeMedia);

  const live = useStore(context.store, ({ live }) => live);

  const isPresent = useMemo(
    () => (typeof matcher === "function" ? matcher(live) : matcher === live),
    [matcher, live],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.span
        aria-label="live"
        {...liveIndicatorProps}
        ref={forwardedRef}
        data-livepeer-controls-live-indicator=""
        data-live={String(Boolean(live))}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

LiveIndicator.displayName = LIVE_INDICATOR_NAME;

export { LiveIndicator };
export type { LiveIndicatorProps };
