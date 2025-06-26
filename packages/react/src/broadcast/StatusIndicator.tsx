"use client";

import type { BroadcastStatus } from "@livepeer/core-web/broadcast";
import { Presence } from "@radix-ui/react-presence";
import React, { useMemo } from "react";
import { useStore } from "zustand";
import { type BroadcastScopedProps, useBroadcastContext } from "../broadcast";
import * as Radix from "../shared/primitive";

const STATUS_INDICATOR_NAME = "StatusIndicator";

type StatusIndicatorElement = React.ElementRef<typeof Radix.Primitive.button>;

interface StatusIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /**
   * The matcher used to determine whether the element should be shown, given the broadcast `status` state.
   *
   * Pending indicates that the stream is currently negotiating WebRTC connection with the server.
   *
   * Required.
   */
  matcher: BroadcastStatus | ((status: BroadcastStatus) => boolean);
}

const StatusIndicator = React.forwardRef<
  StatusIndicatorElement,
  StatusIndicatorProps
>((props: BroadcastScopedProps<StatusIndicatorProps>, forwardedRef) => {
  const {
    __scopeBroadcast,
    forceMount,
    matcher = true,
    ...statusIndicatorProps
  } = props;

  const broadcastContext = useBroadcastContext(
    STATUS_INDICATOR_NAME,
    __scopeBroadcast,
  );

  const status = useStore(broadcastContext.store, ({ status }) => status);

  const isPresent = useMemo(
    () =>
      typeof matcher === "function" ? matcher(status) : matcher === status,
    [matcher, status],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.span
        aria-label={status}
        {...statusIndicatorProps}
        ref={forwardedRef}
        data-livepeer-controls-status-indicator=""
        data-status={String(status)}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

StatusIndicator.displayName = STATUS_INDICATOR_NAME;

export { StatusIndicator };
export type { StatusIndicatorProps };
