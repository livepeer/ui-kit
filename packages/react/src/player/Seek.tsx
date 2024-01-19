"use client";

import * as SliderPrimitive from "@radix-ui/react-slider";
import type * as Radix from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import React, { useEffect } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";

const SEEK_FULLSCREEN_TRIGGER_NAME = "Seek";

type SeekElement = React.ElementRef<typeof Primitive.button>;

interface SeekProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {}

const Seek = React.forwardRef<SeekElement, SeekProps>(
  (props: PlayerScopedProps<SeekProps>, forwardedRef) => {
    const { __scopePlayer, ...seekProps } = props;

    const context = usePlayerContext(
      SEEK_FULLSCREEN_TRIGGER_NAME,
      __scopePlayer,
    );

    const { duration, progress, __controlsFunctions } = useStore(
      context.store,
      ({ duration, progress, __controlsFunctions }) => ({
        duration,
        progress,
        __controlsFunctions,
      }),
    );

    const onValueChange = React.useCallback(
      ([value]: number[]) => __controlsFunctions.requestSeek(value),
      [__controlsFunctions],
    );
    const onValueCommit = React.useCallback(
      ([value]: number[]) => __controlsFunctions.requestSeek(value),
      [__controlsFunctions],
    );

    // const [progress = [0], setProgress] = useControllableState({
    //   prop: [0],
    //   defaultProp: [0],
    //   onChange: onValueChange,
    // });

    // useEffect(() => {
    //   setProgress([progressStore]);
    // }, [setProgress, progressStore]);

    // const title = React.useMemo(
    //   () => (fullscreen ? "Exit full screen (f)" : "Full screen (f)"),
    //   [fullscreen],
    // );

    return (
      <SliderPrimitive.Root
        // aria-label={title}
        // title={title}
        step={0.1}
        max={duration}
        value={[progress]}
        {...seekProps}
        onValueChange={composeEventHandlers(props.onValueChange, onValueChange)}
        onValueCommit={composeEventHandlers(props.onValueCommit, onValueCommit)}
        ref={forwardedRef}
        data-livepeer-player-controls-seek=""
        data-duration={duration}
        data-progress={progress}
      />
    );
  },
);

type SeekTrackProps = SliderPrimitive.SliderTrackProps;
const SeekTrack = SliderPrimitive.Track;
type SeekRangeProps = SliderPrimitive.SliderRangeProps;
const SeekRange = SliderPrimitive.Range;
type SeekThumbProps = SliderPrimitive.SliderThumbProps;
const SeekThumb = SliderPrimitive.Thumb;

export { Seek, SeekTrack, SeekRange, SeekThumb };
export type { SeekProps, SeekTrackProps, SeekRangeProps, SeekThumbProps };
