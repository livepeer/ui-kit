"use client";

import * as SelectPrimitive from "../shared/Select";

import React, { useEffect, useMemo } from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { BroadcastScopedProps, useBroadcastContext } from "./context";

const SOURCE_SELECT_NAME = "SourceSelect";

interface SourceSelectProps
  extends Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot> {
  /**
   *
   */
  type: "video" | "audio";
}

const SourceSelect = (
  props: MediaScopedProps<BroadcastScopedProps<SourceSelectProps>>,
) => {
  const { __scopeMedia, __scopeBroadcast, type, ...controlsProps } = props;

  const context = useMediaContext(SOURCE_SELECT_NAME, __scopeMedia);

  const broadcastContext = useBroadcastContext(
    SOURCE_SELECT_NAME,
    __scopeBroadcast,
  );

  const { enabled, isWebRTCSupported } = useStore(
    broadcastContext.store,
    useShallow(({ enabled, __device }) => ({
      enabled,
      isWebRTCSupported: __device.isWebRTCSupported,
    })),
  );

  useEffect(() => {
    if (!isWebRTCSupported) {
      console.error("WebRTC is not supported on this device.");
    }
  }, [isWebRTCSupported]);

  const shown = useMemo(
    () => enabled && isWebRTCSupported,
    [enabled, isWebRTCSupported],
  );

  return (
    <SelectPrimitive.SelectRoot
      {...controlsProps}
      data-livepeer-source-select=""
      data-type={type}
      data-visible={String(shown)}
    />
  );
};

SourceSelect.displayName = SOURCE_SELECT_NAME;

export { SourceSelect };
export type { SourceSelectProps };
