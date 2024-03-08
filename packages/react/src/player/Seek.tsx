"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import * as SliderPrimitive from "../shared/Slider";

import React from "react";

import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";

import { Presence } from "@radix-ui/react-presence";
import { type MediaScopedProps, useMediaContext } from "../shared/context";
import type * as Radix from "../shared/primitive";
import { noPropagate } from "../shared/utils";

const SEEK_NAME = "Seek";

type SeekElement = React.ElementRef<typeof Radix.Primitive.button>;

interface SeekProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const Seek = React.forwardRef<SeekElement, SeekProps>(
  (props: MediaScopedProps<SeekProps>, forwardedRef) => {
    const { __scopeMedia, forceMount, style, ...seekProps } = props;

    const context = useMediaContext(SEEK_NAME, __scopeMedia);

    const {
      ariaProgress,
      duration,
      buffered,
      bufferedPercent,
      progress,
      live,
      seek,
    } = useStore(
      context.store,
      useShallow(
        ({
          aria,
          duration,
          buffered,
          bufferedPercent,
          progress,
          live,
          __controlsFunctions,
        }) => ({
          ariaProgress: aria.progress,
          duration,
          buffered,
          bufferedPercent,
          progress,
          live,
          seek: __controlsFunctions.requestSeek,
        }),
      ),
    );

    const onValueChange = React.useCallback(
      ([value]: number[]) => seek(value),
      [seek],
    );
    const onValueCommit = React.useCallback(
      ([value]: number[]) => seek(value),
      [seek],
    );

    return (
      <Presence present={forceMount || !live}>
        <SliderPrimitive.Root
          aria-label={live ? "Live Seek Slider" : "Video Seek Slider"}
          aria-valuetext={ariaProgress ?? undefined}
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
          onClick={noPropagate(() => {})}
          ref={forwardedRef}
          data-livepeer-controls-seek=""
          data-duration={duration}
          data-progress={progress}
          data-live={String(live)}
          data-buffered={buffered}
          data-visible={String(!live)}
          style={{
            // biome-ignore lint/suspicious/noExplicitAny: player container css var
            ["--livepeer-player-buffering-width" as any]: `${
              bufferedPercent ?? 0
            }%`,
            ...style,
          }}
        />
      </Presence>
    );
  },
);

Seek.displayName = SEEK_NAME;

const SEEK_BUFFER_NAME = "SeekBuffer";

type SeekBufferElement = React.ElementRef<typeof SliderPrimitive.Track>;

interface SeekBufferProps
  extends Radix.ComponentPropsWithoutRef<typeof SliderPrimitive.Track> {}

const SeekBuffer = React.forwardRef<SeekBufferElement, SeekBufferProps>(
  (props: MediaScopedProps<SeekBufferProps>, forwardedRef) => {
    const { __scopeMedia, style, ...bufferProps } = props;

    const context = useMediaContext(SEEK_BUFFER_NAME, __scopeMedia);

    const { bufferedPercent, buffered } = useStore(
      context.store,
      useShallow(({ bufferedPercent, buffered }) => ({
        buffered,
        bufferedPercent,
      })),
    );

    return (
      <SliderPrimitive.Track
        {...bufferProps}
        ref={forwardedRef}
        style={{
          left: 0,
          right: `${100 - (bufferedPercent ?? 0)}%`,
          ...style,
        }}
        data-livepeer-controls-seek-buffer=""
        data-buffered={buffered}
      />
    );
  },
);

SeekBuffer.displayName = SEEK_BUFFER_NAME;

export { Seek, SeekBuffer };
export type { SeekBufferProps, SeekProps };
