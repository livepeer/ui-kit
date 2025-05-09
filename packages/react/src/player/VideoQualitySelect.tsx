"use client";

import * as SelectPrimitive from "../shared/Select";

import React, { useCallback } from "react";

import { useStore } from "zustand";
import { type MediaScopedProps, useMediaContext } from "../shared/context";

import type { VideoQuality } from "@livepeer/core/media";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useShallow } from "zustand/react/shallow";
import type * as Radix from "../shared/primitive";

/**
 * VideoQualitySelect
 */

const VIDEO_QUALITY_SELECT_NAME = "VideoQualitySelect";

interface VideoQualitySelectProps
  extends Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot> {}

const VideoQualitySelect = (
  props: MediaScopedProps<VideoQualitySelectProps>,
) => {
  const { __scopeMedia, defaultValue, ...videoQualitySelectProps } = props;

  const context = useMediaContext(VIDEO_QUALITY_SELECT_NAME, __scopeMedia);

  const { videoQuality, setVideoQuality } = useStore(
    context.store,
    useShallow(({ videoQuality, __controlsFunctions }) => ({
      videoQuality,
      setVideoQuality: __controlsFunctions.setVideoQuality,
    })),
  );

  const onValueChangeComposed = useCallback(
    (value: string) => {
      if (props.onValueChange) {
        props.onValueChange(value);
      }
      setVideoQuality(value as VideoQuality);
    },
    [props.onValueChange, setVideoQuality],
  );

  return (
    <SelectPrimitive.SelectRoot
      {...videoQualitySelectProps}
      value={videoQuality}
      onValueChange={onValueChangeComposed}
      data-livepeer-quality-select=""
      data-video-quality={String(videoQuality)}
    />
  );
};

VideoQualitySelect.displayName = VIDEO_QUALITY_SELECT_NAME;

/**
 * VideoQualitySelectItem
 */

const VIDEO_QUALITY_SELECT_ITEM_NAME = "VideoQualitySelectItem";

type VideoQualitySelectItemElement = React.ElementRef<
  typeof SelectPrimitive.SelectItem
>;

interface VideoQualitySelectItemProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectItem>,
    "value"
  > {
  /**
   * The numerical value of the quality select item. This must be provided.
   */
  value: VideoQuality;
}

const VideoQualitySelectItem = React.forwardRef<
  VideoQualitySelectItemElement,
  VideoQualitySelectItemProps
>((props: MediaScopedProps<VideoQualitySelectItemProps>, forwardedRef) => {
  const { __scopeMedia, ...videoQualitySelectItemProps } = props;

  return (
    <SelectPrimitive.SelectItem
      {...videoQualitySelectItemProps}
      ref={forwardedRef}
      data-livepeer-quality-select-item=""
    />
  );
});

VideoQualitySelectItem.displayName = VIDEO_QUALITY_SELECT_ITEM_NAME;

export { VideoQualitySelect, VideoQualitySelectItem };
export type { VideoQualitySelectItemProps, VideoQualitySelectProps };
