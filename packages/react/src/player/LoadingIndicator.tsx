"use client";

import React from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import * as Radix from "./primitive";

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

  const loading = useStore(context.store, ({ loading }) => loading);

  return (
    <Presence present={forceMount || loading}>
      <Radix.Primitive.div
        aria-label={"Loading"}
        {...offlineErrorProps}
        ref={forwardedRef}
        data-livepeer-player-loading-indicator=""
        data-loading-state={String(Boolean(loading))}
        data-visible={String(loading)}
      />
    </Presence>
  );
});

LoadingIndicator.displayName = LOADING_INDICATOR_NAME;

export { LoadingIndicator };
export type { LoadingIndicatorProps };
