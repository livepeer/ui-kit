"use client";

import * as SelectPrimitive from "../shared/Select";

import React from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { composeEventHandlers } from "@radix-ui/primitive";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";

const QUALITY_SELECT_CONTENT_NAME = "QualitySelect";

type QualitySelectElement = React.ElementRef<
  typeof SelectPrimitive.SelectContent
>;

interface QualitySelectProps
  extends Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot> {}

const QualitySelect = React.forwardRef<
  QualitySelectElement,
  QualitySelectProps
>((props: MediaScopedProps<QualitySelectProps>, forwardedRef) => {
  const { __scopeMedia, defaultValue, ...controlsProps } = props;

  const context = useMediaContext(QUALITY_SELECT_CONTENT_NAME, __scopeMedia);

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
      value={String(playbackRate)}
      onValueChange={composeEventHandlers(props.onValueChange, setPlaybackRate)}
      data-livepeer-quality-select=""
      data-quality={String(playbackRate)}
    />
  );
});

QualitySelect.displayName = QUALITY_SELECT_CONTENT_NAME;

export { QualitySelect };
export type { QualitySelectProps };
