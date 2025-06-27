"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import { Presence } from "@radix-ui/react-presence";
import React, { useMemo } from "react";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { noPropagate } from "../shared/utils";
import { type BroadcastScopedProps, useBroadcastContext } from "./context";

/**
 * ScreenshareTrigger
 */

const SCREENSHARE_TRIGGER_NAME = "ScreenshareTrigger";

type ScreenshareTriggerElement = React.ElementRef<
  typeof Radix.Primitive.button
>;

interface ScreenshareTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const ScreenshareTrigger = React.forwardRef<
  ScreenshareTriggerElement,
  ScreenshareTriggerProps
>((props: BroadcastScopedProps<ScreenshareTriggerProps>, forwardedRef) => {
  const { __scopeBroadcast, forceMount, ...screenshareProps } = props;

  const broadcastContext = useBroadcastContext(
    SCREENSHARE_TRIGGER_NAME,
    __scopeBroadcast,
  );

  const { isSupported, isActive, title, toggleDisplayMedia } = useStore(
    broadcastContext.store,
    useShallow(({ mediaDeviceIds, aria, __device, __controlsFunctions }) => ({
      isActive: mediaDeviceIds.videoinput === "screen",
      title: aria.screenshareTrigger,
      toggleDisplayMedia: __controlsFunctions.toggleDisplayMedia,
      isSupported: __device.isDisplayMediaSupported,
    })),
  );

  return (
    <Presence present={forceMount || isSupported}>
      <Radix.Primitive.button
        type="button"
        aria-pressed={isActive}
        aria-label={title}
        title={title}
        {...screenshareProps}
        onClick={composeEventHandlers(
          props.onClick,
          noPropagate(toggleDisplayMedia),
        )}
        ref={forwardedRef}
        data-livepeer-controls-screenshare-trigger=""
        data-active={String(isActive)}
        data-visible={String(isSupported)}
      />
    </Presence>
  );
});

ScreenshareTrigger.displayName = SCREENSHARE_TRIGGER_NAME;

/**
 * ScreenshareIndicator
 */

const SCREENSHARE_INDICATOR_NAME = "ScreenshareIndicator";

type ScreenshareIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface ScreenshareIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /**
   * The matcher used to determine whether the element should be shown, given the screenshare state.
   * Defaults to `true`, which means "shown when screenshare is active".
   */
  matcher?: boolean | ((state: boolean) => boolean);
}

const ScreenshareIndicator = React.forwardRef<
  ScreenshareIndicatorElement,
  ScreenshareIndicatorProps
>((props: BroadcastScopedProps<ScreenshareIndicatorProps>, forwardedRef) => {
  const {
    __scopeBroadcast,
    forceMount,
    matcher = true,
    ...audioIndicatorProps
  } = props;

  const broadcastContext = useBroadcastContext(
    SCREENSHARE_INDICATOR_NAME,
    __scopeBroadcast,
  );

  const { isActive, isSupported } = useStore(
    broadcastContext.store,
    ({ mediaDeviceIds, __device }) => ({
      isActive: mediaDeviceIds.videoinput === "screen",
      isSupported: __device.isDisplayMediaSupported,
    }),
  );

  const isPresent = useMemo(
    () =>
      isSupported
        ? typeof matcher === "boolean"
          ? matcher === isActive
          : matcher(isActive)
        : false,
    [isSupported, isActive, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...audioIndicatorProps}
        ref={forwardedRef}
        data-livepeer-controls-screenshare-indicator=""
        data-active={String(isActive)}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

ScreenshareIndicator.displayName = SCREENSHARE_INDICATOR_NAME;

export { ScreenshareIndicator, ScreenshareTrigger };
export type { ScreenshareIndicatorProps, ScreenshareTriggerProps };
