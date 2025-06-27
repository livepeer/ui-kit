"use client";

import React from "react";

import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { type MediaScopedProps, useMediaContext } from "./context";
import * as Radix from "./primitive";

const TIME_NAME = "Time";

type TimeElement = React.ElementRef<typeof Radix.Primitive.button>;

interface TimeProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button>,
    "children"
  > {}

const Time = React.forwardRef<TimeElement, TimeProps>(
  (props: MediaScopedProps<TimeProps>, forwardedRef) => {
    const { __scopeMedia, ...timeProps } = props;

    const context = useMediaContext(TIME_NAME, __scopeMedia);

    const { progress, duration, live, formattedTime } = useStore(
      context.store,
      useShallow(({ progress, duration, live, aria }) => ({
        formattedTime: aria.time,
        progress,
        duration,
        live,
      })),
    );

    return (
      <Radix.Primitive.span
        aria-label={formattedTime ?? undefined}
        title={formattedTime ?? undefined}
        {...timeProps}
        ref={forwardedRef}
        data-livepeer-controls-time=""
        data-duration={duration}
        data-progress={progress}
        data-live={String(live)}
      >
        {formattedTime}
      </Radix.Primitive.span>
    );
  },
);

Time.displayName = TIME_NAME;

export { Time };
export type { TimeProps };
