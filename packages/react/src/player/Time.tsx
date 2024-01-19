"use client";

import type * as Radix from "@radix-ui/react-primitive";

import React, { useMemo } from "react";

import { getFormattedHoursMinutesSeconds } from "@livepeer/core-web/utils";
import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";

const TIME_NAME = "Time";

type TimeElement = React.ElementRef<typeof Primitive.button>;

interface TimeProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.button> {}

const Time = React.forwardRef<TimeElement, TimeProps>(
  (props: PlayerScopedProps<TimeProps>, forwardedRef) => {
    const { __scopePlayer, ...timeProps } = props;

    const context = usePlayerContext(TIME_NAME, __scopePlayer);

    const { progress, duration, live } = useStore(
      context.store,
      ({ progress, duration, live }) => ({
        progress,
        duration,
        live,
      }),
    );

    const formattedTimeDisplay = useMemo(
      () => getFormattedHoursMinutesSeconds(progress ?? null),
      [progress],
    );

    const formattedDuration = useMemo(
      () => getFormattedHoursMinutesSeconds(duration ?? null),
      [duration],
    );

    const formattedTime = useMemo(
      () =>
        live
          ? formattedTimeDisplay
          : `${formattedTimeDisplay} / ${formattedDuration}`,
      [formattedTimeDisplay, formattedDuration, live],
    );

    return (
      <Primitive.span
        type="button"
        aria-label={formattedTime}
        title={formattedTime}
        {...timeProps}
        ref={forwardedRef}
        data-livepeer-player-controls-time=""
      >
        {formattedTime}
      </Primitive.span>
    );
  },
);

export { Time };
export type { TimeProps };
