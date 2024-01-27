"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as Radix from "../shared/primitive";

import React from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { MediaScopedProps } from "../context";
import { noPropagate } from "../shared/utils";
import { useBroadcastContext } from "./context";

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
>((props: MediaScopedProps<ScreenshareTriggerProps>, forwardedRef) => {
  const { __scopeMedia, forceMount, ...clipTriggerProps } = props;

  const context = useBroadcastContext(SCREENSHARE_TRIGGER_NAME, __scopeMedia);

  const { requestDisplayMedia, isEnabled, title } = useStore(
    context.store,
    useShallow(({ __controlsFunctions, __device, aria }) => ({
      requestDisplayMedia: __controlsFunctions.requestDisplayMedia,
      isEnabled: __device.isMediaDevicesSupported,
      title: aria.screenshareTrigger,
    })),
  );

  return (
    <Presence present={forceMount || Boolean(isEnabled)}>
      <Radix.Primitive.button
        type="button"
        // aria-label={title ?? undefined}
        // title={title ?? undefined}
        {...clipTriggerProps}
        onClick={composeEventHandlers(
          props.onClick,
          noPropagate(requestDisplayMedia),
        )}
        ref={forwardedRef}
        data-livepeer-controls-clip-button=""
        data-visible={String(Boolean(isEnabled))}
      />
    </Presence>
  );
});

ScreenshareTrigger.displayName = SCREENSHARE_TRIGGER_NAME;

export { ScreenshareTrigger };
export type { ScreenshareTriggerProps };
