"use client";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import * as Radix from "./primitive";
import { useShallow } from "zustand/react/shallow";

const TIME_NAME = "Time";

type TimeElement = React.ElementRef<typeof Radix.Primitive.button>;

interface TimeProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const Time = React.forwardRef<TimeElement, TimeProps>(
  (props: PlayerScopedProps<TimeProps>, forwardedRef) => {
    const { __scopePlayer, ...timeProps } = props;

    const context = usePlayerContext(TIME_NAME, __scopePlayer);

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
        type="button"
        aria-label={formattedTime ?? undefined}
        title={formattedTime ?? undefined}
        {...timeProps}
        ref={forwardedRef}
        data-livepeer-player-controls-time=""
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
