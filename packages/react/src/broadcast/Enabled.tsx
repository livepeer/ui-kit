"use client";

import { composeEventHandlers } from "@radix-ui/primitive";

import React, { useMemo } from "react";

import { useStore } from "zustand";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import { MediaScopedProps, useMediaContext } from "../context";
import * as Radix from "../shared/primitive";
import { noPropagate } from "../shared/utils";
import { BroadcastScopedProps, useBroadcastContext } from "./context";

/**
 * EnabledTrigger
 */

const ENABLED_TRIGGER_NAME = "EnabledTrigger";

type EnabledTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface EnabledTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const EnabledTrigger = React.forwardRef<
  EnabledTriggerElement,
  EnabledTriggerProps
>((props: BroadcastScopedProps<EnabledTriggerProps>, forwardedRef) => {
  const { __scopeBroadcast, ...playProps } = props;

  const broadcastContext = useBroadcastContext(
    ENABLED_TRIGGER_NAME,
    __scopeBroadcast,
  );

  const { enabled, title, toggleEnabled } = useStore(
    broadcastContext.store,
    useShallow(({ enabled, aria, __controlsFunctions }) => ({
      enabled,
      title: aria.start,
      toggleEnabled: __controlsFunctions.toggleEnabled,
    })),
  );

  return (
    <Radix.Primitive.button
      type="button"
      aria-pressed={enabled}
      aria-label={title}
      title={title}
      {...playProps}
      onClick={composeEventHandlers(props.onClick, noPropagate(toggleEnabled))}
      ref={forwardedRef}
      data-livepeer-controls-start-trigger=""
      data-started={String(enabled)}
    />
  );
});

EnabledTrigger.displayName = ENABLED_TRIGGER_NAME;

/**
 * EnabledIndicator
 */

const ENABLED_INDICATOR_NAME = "EnabledIndicator";

type EnabledIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface EnabledIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
  /**
   * The matcher used to determine whether the element should be shown, given the `enabled` state.
   * Defaults to `true`, which means "broadcasting is enabled".
   */
  matcher?: boolean | ((state: boolean) => boolean);
}

const EnabledIndicator = React.forwardRef<
  EnabledIndicatorElement,
  EnabledIndicatorProps
>(
  (
    props: MediaScopedProps<BroadcastScopedProps<EnabledIndicatorProps>>,
    forwardedRef,
  ) => {
    const {
      __scopeBroadcast,
      __scopeMedia,
      forceMount,
      matcher = true,
      ...playPauseIndicatorProps
    } = props;

    const context = useMediaContext(ENABLED_INDICATOR_NAME, __scopeMedia);

    const loading = useStore(context.store, ({ loading }) => loading);

    const broadcastContext = useBroadcastContext(
      ENABLED_INDICATOR_NAME,
      __scopeBroadcast,
    );

    const enabled = useStore(broadcastContext.store, ({ enabled }) => enabled);

    const isPresent = useMemo(
      () =>
        !loading &&
        (typeof matcher === "boolean" ? matcher === enabled : matcher(enabled)),
      [enabled, matcher, loading],
    );

    return (
      <Presence present={forceMount || isPresent}>
        <Radix.Primitive.div
          {...playPauseIndicatorProps}
          ref={forwardedRef}
          data-livepeer-controls-play-pause-indicator=""
          data-enabled={String(enabled)}
          data-visible={String(isPresent)}
        />
      </Presence>
    );
  },
);

EnabledIndicator.displayName = ENABLED_INDICATOR_NAME;

export { EnabledIndicator, EnabledTrigger };
export type { EnabledIndicatorProps, EnabledTriggerProps };
