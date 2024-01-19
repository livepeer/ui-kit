"use client";

import * as Radix from "./primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import React, { useEffect } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { useShallow } from "zustand/react/shallow";

const FULLSCREEN_TRIGGER_NAME = "FullscreenTrigger";

type FullscreenTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface FullscreenTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
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

  const { fullscreenStore, requestToggleFullscreen } = useStore(
    context.store,
    useShallow(({ fullscreen, __controlsFunctions }) => ({
      fullscreenStore: fullscreen,
      requestToggleFullscreen: __controlsFunctions.requestToggleFullscreen,
    })),
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
    () => requestToggleFullscreen(),
    [requestToggleFullscreen],
  );

  const title = React.useMemo(
    () => (fullscreen ? "Exit full screen (f)" : "Full screen (f)"),
    [fullscreen],
  );

  return (
    <Radix.Primitive.button
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
