"use client";

import type * as Radix from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import React, { useEffect } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";

const FULLSCREEN_TRIGGER_NAME = "FullscreenTrigger";

type FullscreenTriggerElement = React.ElementRef<typeof Primitive.button>;

interface FullscreenTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.button> {
  fullscreen?: boolean;
  onFullscreenChange?(fullscreen: boolean): void;
}

const FullscreenTrigger = React.forwardRef<
  FullscreenTriggerElement,
  FullscreenTriggerProps
>((props: PlayerScopedProps<FullscreenTriggerProps>, forwardedRef) => {
  const {
    __scopePlayer,
    style,
    fullscreen: fullscreenProp,
    onFullscreenChange,
    ...fullscreenProps
  } = props;

  const context = usePlayerContext(FULLSCREEN_TRIGGER_NAME, __scopePlayer);

  const { fullscreenStore, __controlsFunctions } = useStore(
    context.store,
    ({ fullscreen, __controlsFunctions }) => ({
      fullscreenStore: fullscreen,
      __controlsFunctions,
    }),
  );

  const [fullscreen = false, setFullscreen] = useControllableState({
    prop: fullscreenProp,
    defaultProp: false,
    onChange: onFullscreenChange,
  });

  useEffect(() => {
    setFullscreen(fullscreenStore);
  }, [setFullscreen, fullscreenStore]);

  const toggleFullscreen = React.useCallback(
    () => __controlsFunctions.requestToggleFullscreen(),
    [__controlsFunctions],
  );

  const title = React.useMemo(
    () => (fullscreen ? "Exit full screen (f)" : "Full screen (f)"),
    [fullscreen],
  );

  return (
    <Primitive.button
      type="button"
      aria-pressed={fullscreen}
      aria-label={title}
      title={title}
      {...fullscreenProps}
      onClick={composeEventHandlers(props.onClick, toggleFullscreen)}
      ref={forwardedRef}
      data-livepeer-player-controls-fullscreen-button=""
      data-fullscreen={fullscreen}
    />
  );
});

export { FullscreenTrigger };
export type { FullscreenTriggerProps };
