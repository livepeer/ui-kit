"use client";

import React, { useMemo } from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";
import * as Radix from "./primitive";

const LOADING_INDICATOR_NAME = "LoadingIndicator";

type LoadingIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface LoadingIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
  /** The matcher used to determine whether the element should be shown, given the `loading` state. Defaults to `true`. */
  matcher?: boolean | ((live: boolean) => boolean);
}

const LoadingIndicator = React.forwardRef<
  LoadingIndicatorElement,
  LoadingIndicatorProps
>((props: MediaScopedProps<LoadingIndicatorProps>, forwardedRef) => {
  const {
    __scopeMedia,
    forceMount,
    matcher = true,
    ...offlineErrorProps
  } = props;

  const context = useMediaContext(LOADING_INDICATOR_NAME, __scopeMedia);

  const loading = useStore(context.store, ({ loading }) => loading);

  const isPresent = useMemo(
    () =>
      typeof matcher === "function" ? matcher(loading) : matcher === loading,
    [matcher, loading],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        aria-label={"Loading"}
        {...offlineErrorProps}
        ref={forwardedRef}
        data-livepeer-loading-indicator=""
        data-loading-state={String(Boolean(loading))}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

LoadingIndicator.displayName = LOADING_INDICATOR_NAME;

export { LoadingIndicator };
export type { LoadingIndicatorProps };
