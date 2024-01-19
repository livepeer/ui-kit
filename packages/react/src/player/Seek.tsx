"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as SliderPrimitive from "./Slider";
import { getHoursMinutesSeconds } from "@livepeer/core-web/utils";

import React, { useMemo } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { useShallow } from "zustand/react/shallow";

import * as Radix from "./primitive";
import { Presence } from "@radix-ui/react-presence";

const SEEK_TRIGGER_NAME = "Seek";

type SeekElement = React.ElementRef<typeof Radix.Primitive.button>;

interface SeekProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  forceMount?: boolean;
}

const Seek = React.forwardRef<SeekElement, SeekProps>(
  (props: PlayerScopedProps<SeekProps>, forwardedRef) => {
    const { __scopePlayer, forceMount, ...seekProps } = props;

    const context = usePlayerContext(SEEK_TRIGGER_NAME, __scopePlayer);

    const { duration, progress, live, seek } = useStore(
      context.store,
      useShallow(({ duration, progress, live, __controlsFunctions }) => ({
        duration,
        progress,
        live,
        seek: __controlsFunctions.requestSeek,
      })),
    );

    const onValueChange = React.useCallback(
      ([value]: number[]) => seek(value),
      [seek],
    );
    const onValueCommit = React.useCallback(
      ([value]: number[]) => seek(value),
      [seek],
    );

    const progressParsed = useMemo(
      () => getHoursMinutesSeconds(progress ?? null),
      [progress],
    );

    const durationParsed = useMemo(
      () => getHoursMinutesSeconds(duration ?? null),
      [duration],
    );

    const title = useMemo(() => {
      const progressText = `${
        progressParsed.hours ? `${progressParsed.hours} hours` : ""
      } ${progressParsed.minutes ? `${progressParsed.minutes} minutes` : ""} ${
        progressParsed.seconds ? `${progressParsed.seconds} seconds` : ""
      }`;
      const durationText = `${
        durationParsed.hours ? `${durationParsed.hours} hours` : ""
      } ${durationParsed.minutes ? `${durationParsed.minutes} minutes` : ""} ${
        durationParsed.seconds ? `${durationParsed.seconds} seconds` : ""
      }`;

      return live
        ? `Live ${progressText}`
        : `${progressText} of ${durationText}`;
    }, [live, progressParsed, durationParsed]);

    return (
      <Presence present={forceMount || !live}>
        <SliderPrimitive.Root
          aria-label={live ? "Live Seek Slider" : "Video Seek Slider"}
          aria-valuetext={title}
          step={0.1}
          max={duration}
          value={[progress]}
          role="slider"
          {...seekProps}
          onValueChange={composeEventHandlers(
            props.onValueChange,
            onValueChange,
          )}
          onValueCommit={composeEventHandlers(
            props.onValueCommit,
            onValueCommit,
          )}
          ref={forwardedRef}
          data-livepeer-player-controls-seek=""
          data-duration={duration}
          data-progress={progress}
          data-live={String(live)}
        />
      </Presence>
    );
  },
);

export { Seek };
export type { SeekProps };
