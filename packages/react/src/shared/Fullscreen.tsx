"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";

import { composeEventHandlers } from "@radix-ui/primitive";

import { noPropagate } from "./utils";

/**
 * FullscreenIndicator
 */

const FULLSCREEN_INDICATOR_NAME = "FullscreenIndicator";

type FullscreenIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface FullscreenIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /** The matcher used to determine whether the element should be shown, given the fullscreen state. Defaults to `true`. */
  matcher?: boolean | ((fullscreen: boolean) => boolean);
}

const FullscreenIndicator = React.forwardRef<
  FullscreenIndicatorElement,
  FullscreenIndicatorProps
>((props: MediaScopedProps<FullscreenIndicatorProps>, forwardedRef) => {
  const {
    __scopeMedia,
    forceMount,
    matcher = true,
    ...fullscreenIndicatorProps
  } = props;

  const context = useMediaContext(FULLSCREEN_INDICATOR_NAME, __scopeMedia);

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
        data-livepeer-controls-fullscreen-indicator=""
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
>((props: MediaScopedProps<FullscreenTriggerProps>, forwardedRef) => {
  const { __scopeMedia, ...fullscreenProps } = props;

  const context = useMediaContext(FULLSCREEN_TRIGGER_NAME, __scopeMedia);

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
      data-livepeer-controls-fullscreen-trigger=""
      data-fullscreen-state={String(Boolean(fullscreen))}
    />
  );
});

FullscreenTrigger.displayName = FULLSCREEN_TRIGGER_NAME;

export { FullscreenIndicator, FullscreenTrigger };
export type { FullscreenIndicatorProps, FullscreenTriggerProps };
