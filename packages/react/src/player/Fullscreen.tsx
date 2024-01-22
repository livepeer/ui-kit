"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

import { composeEventHandlers } from "@radix-ui/primitive";

import { noPropagate } from "./shared";

/**
 * FullscreenIndicator
 */

const FULLSCREEN_INDICATOR_NAME = "FullscreenIndicator";

type FullscreenIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface FullscreenIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
  /** The matcher used to determine whether the element should be shown, given the fullscreen state. Defaults to `true`. */
  matcher?: boolean | ((fullscreen: boolean) => boolean);
}

const FullscreenIndicator = React.forwardRef<
  FullscreenIndicatorElement,
  FullscreenIndicatorProps
>((props: PlayerScopedProps<FullscreenIndicatorProps>, forwardedRef) => {
  const {
    __scopePlayer,
    forceMount,
    matcher = true,
    ...fullscreenIndicatorProps
  } = props;

  const context = usePlayerContext(FULLSCREEN_INDICATOR_NAME, __scopePlayer);

  const fullscreen = useStore(
    context.store,
    useShallow(({ fullscreen }) => fullscreen),
  );

  const isPresent = useMemo(
    () =>
      typeof matcher === "function"
        ? matcher(fullscreen)
        : matcher === fullscreen,
    [matcher, fullscreen],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...fullscreenIndicatorProps}
        ref={forwardedRef}
        data-livepeer-player-controls-fullscreen-indicator=""
        data-fullscreen={String(Boolean(fullscreen))}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

FullscreenIndicator.displayName = FULLSCREEN_INDICATOR_NAME;

/**
 * FullscreenTrigger
 */

const FULLSCREEN_TRIGGER_NAME = "FullscreenTrigger";

type FullscreenTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface FullscreenTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const FullscreenTrigger = React.forwardRef<
  FullscreenTriggerElement,
  FullscreenTriggerProps
>((props: PlayerScopedProps<FullscreenTriggerProps>, forwardedRef) => {
  const { __scopePlayer, style, ...fullscreenProps } = props;

  const context = usePlayerContext(FULLSCREEN_TRIGGER_NAME, __scopePlayer);

  const { title, fullscreen, requestToggleFullscreen } = useStore(
    context.store,
    useShallow(({ fullscreen, __controlsFunctions, aria }) => ({
      fullscreen,
      requestToggleFullscreen: __controlsFunctions.requestToggleFullscreen,
      title: aria.fullscreen,
    })),
  );

  return (
    <Radix.Primitive.button
      type="button"
      aria-pressed={fullscreen}
      aria-label={title ?? undefined}
      title={title ?? undefined}
      {...fullscreenProps}
      onClick={composeEventHandlers(
        props.onClick,
        noPropagate(requestToggleFullscreen),
      )}
      ref={forwardedRef}
      data-livepeer-player-controls-fullscreen-trigger=""
      data-fullscreen-state={String(Boolean(fullscreen))}
    />
  );
});

FullscreenTrigger.displayName = FULLSCREEN_TRIGGER_NAME;

export { FullscreenIndicator, FullscreenTrigger };
export type { FullscreenIndicatorProps, FullscreenTriggerProps };
