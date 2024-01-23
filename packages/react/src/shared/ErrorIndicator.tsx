"use client";

import React, { useMemo } from "react";

import { PlaybackError } from "@livepeer/core";
import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";
import * as Radix from "./primitive";

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
>((props: MediaScopedProps<ErrorIndicatorProps>, forwardedRef) => {
  const { __scopeMedia, forceMount, matcher, ...offlineErrorProps } = props;

  const context = useMediaContext(ERROR_INDICATOR_NAME, __scopeMedia);

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
        data-livepeer-error-indicator=""
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
