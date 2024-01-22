"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import * as Radix from "./primitive";
import { Presence } from "@radix-ui/react-presence";
import { PlaybackError } from "@livepeer/core-react";

const ERROR_INDICATOR_NAME = "ErrorIndicator";

type ErrorIndicatorElement = React.ElementRef<typeof Radix.Primitive.div>;

interface ErrorIndicatorProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div> {
  forceMount?: boolean;
  /** The matcher used to determine whether the element should be shown, given the error state. */
  matcher: PlaybackError["type"] | ((state: PlaybackError["type"]) => boolean);
}

const ErrorIndicator = React.forwardRef<
  ErrorIndicatorElement,
  ErrorIndicatorProps
>((props: PlayerScopedProps<ErrorIndicatorProps>, forwardedRef) => {
  const { __scopePlayer, forceMount, matcher, ...offlineErrorProps } = props;

  const context = usePlayerContext(ERROR_INDICATOR_NAME, __scopePlayer);

  const error = useStore(context.store, ({ error }) => error);

  const isPresent = useMemo(
    () =>
      error
        ? typeof matcher === "string"
          ? matcher === error.type
          : matcher(error.type)
        : false,
    [error, matcher],
  );

  return (
    <Presence present={forceMount || isPresent}>
      <Radix.Primitive.div
        {...offlineErrorProps}
        ref={forwardedRef}
        data-livepeer-player-error-indicator=""
        data-error-state={String(Boolean(error))}
        data-error-type={error?.type ?? "none"}
        data-visible={String(isPresent)}
      />
    </Presence>
  );
});

ErrorIndicator.displayName = ERROR_INDICATOR_NAME;

export { ErrorIndicator };
export type { ErrorIndicatorProps };
