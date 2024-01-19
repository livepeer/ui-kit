"use client";

import React from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import * as Radix from "./primitive";
import { Presence } from "@radix-ui/react-presence";
import { PlaybackError } from "@livepeer/core-react";

const LOADING_INDICATOR_NAME = "LoadingIndicator";

type LoadingIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface LoadingIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
}

const LoadingIndicator = React.forwardRef<
  LoadingIndicatorElement,
  LoadingIndicatorProps
>((props: PlayerScopedProps<LoadingIndicatorProps>, forwardedRef) => {
  const { __scopePlayer, forceMount, ...offlineErrorProps } = props;

  const context = usePlayerContext(LOADING_INDICATOR_NAME, __scopePlayer);

  const playbackState = useStore(
    context.store,
    ({ playbackState }) => playbackState,
  );

  return (
    <Presence present={forceMount || playbackState === "loading"}>
      <Radix.Primitive.div
        aria-label={"Loading"}
        {...offlineErrorProps}
        ref={forwardedRef}
        data-livepeer-player-loading-indicator=""
      />
    </Presence>
  );
});

export { LoadingIndicator };
export type { LoadingIndicatorProps };
