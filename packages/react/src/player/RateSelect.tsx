"use client";

import * as SelectPrimitive from "../shared/Select";

import React from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { composeEventHandlers } from "@radix-ui/primitive";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";

const RATE_SELECT_CONTENT_NAME = "RateSelect";

type RateSelectElement = React.ElementRef<typeof SelectPrimitive.SelectContent>;

interface RateSelectProps
  extends Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot> {}

const RateSelect = React.forwardRef<RateSelectElement, RateSelectProps>(
  (props: MediaScopedProps<RateSelectProps>, forwardedRef) => {
    const { __scopeMedia, defaultValue, ...controlsProps } = props;

    const context = useMediaContext(RATE_SELECT_CONTENT_NAME, __scopeMedia);

    const { playbackRate, setPlaybackRate } = useStore(
      context.store,
      useShallow(({ playbackRate, __controlsFunctions }) => ({
        playbackRate,
        setPlaybackRate: __controlsFunctions.setPlaybackRate,
      })),
    );

    return (
      <SelectPrimitive.SelectRoot
        {...controlsProps}
        value={playbackRate.toFixed(2)}
        onValueChange={composeEventHandlers(
          props.onValueChange,
          setPlaybackRate,
        )}
        data-livepeer-rate-select=""
        data-rate={String(playbackRate)}
      />
    );
  },
);

RateSelect.displayName = RATE_SELECT_CONTENT_NAME;

export { RateSelect };
export type { RateSelectProps };
