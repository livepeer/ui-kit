"use client";

import * as SelectPrimitive from "../shared/Select";

import React from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../shared/context";

import { composeEventHandlers } from "@radix-ui/primitive";
import { useShallow } from "zustand/react/shallow";

import { PlaybackRate } from "@livepeer/core/media";
import * as Radix from "../shared/primitive";

/**
 * RateSelect
 */

const RATE_SELECT_NAME = "RateSelect";

interface RateSelectProps
  extends Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot> {}

const RateSelect = (props: MediaScopedProps<RateSelectProps>) => {
  const { __scopeMedia, defaultValue, ...rateSelectProps } = props;

  const context = useMediaContext(RATE_SELECT_NAME, __scopeMedia);

  const { playbackRate, setPlaybackRate } = useStore(
    context.store,
    useShallow(({ playbackRate, __controlsFunctions }) => ({
      playbackRate,
      setPlaybackRate: __controlsFunctions.setPlaybackRate,
    })),
  );

  return (
    <SelectPrimitive.SelectRoot
      {...rateSelectProps}
      value={playbackRate === "constant" ? "constant" : playbackRate.toFixed(2)}
      onValueChange={composeEventHandlers(props.onValueChange, setPlaybackRate)}
      data-livepeer-rate-select=""
      data-rate={String(playbackRate)}
    />
  );
};

RateSelect.displayName = RATE_SELECT_NAME;

/**
 * RateSelectItem
 */

const RATE_SELECT_ITEM_NAME = "RateSelectItem";

type RateSelectItemElement = React.ElementRef<
  typeof SelectPrimitive.SelectItem
>;

interface RateSelectItemProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectItem>,
    "value"
  > {
  /**
   * The numerical value of the rate select item. This must be provided and must be a number or `constant`,
   * which indicates a constant playback rate.
   */
  value: PlaybackRate;
}

const RateSelectItem = React.forwardRef<
  RateSelectItemElement,
  RateSelectItemProps
>((props: MediaScopedProps<RateSelectItemProps>, forwardedRef) => {
  const { __scopeMedia, value, ...rateSelectItemProps } = props;

  return (
    <SelectPrimitive.SelectItem
      {...rateSelectItemProps}
      ref={forwardedRef}
      value={Number(value).toFixed(2)}
      data-livepeer-rate-select-item=""
    />
  );
});

RateSelectItem.displayName = RATE_SELECT_ITEM_NAME;

export { RateSelect, RateSelectItem };
export type { RateSelectItemProps, RateSelectProps };
