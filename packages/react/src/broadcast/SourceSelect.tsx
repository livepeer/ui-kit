"use client";

import * as SelectPrimitive from "../shared/Select";

import React, { useCallback } from "react";

import { useStore } from "zustand";
import { MediaScopedProps } from "../context";

import { MediaDeviceInfoExtended } from "@livepeer/core-web/broadcast";
import { composeEventHandlers } from "@radix-ui/primitive";
import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";
import { BroadcastScopedProps, useBroadcastContext } from "./context";

const SOURCE_SELECT_NAME = "SourceSelect";

interface SourceSelectProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot>,
    "children"
  > {
  /**
   * The type of media device to filter the list by.
   */
  type: MediaDeviceKind;

  /**
   * Children which consume the media device info passed down via a function.
   *
   * @param devices the media device info for all available media devices.
   * @returns Select children using the media devices.
   */
  children: (devices: MediaDeviceInfoExtended[] | null) => React.ReactNode;
}

const SourceSelect = (
  props: MediaScopedProps<BroadcastScopedProps<SourceSelectProps>>,
) => {
  const { __scopeMedia, __scopeBroadcast, type, children, ...controlsProps } =
    props;

  const broadcastContext = useBroadcastContext(
    SOURCE_SELECT_NAME,
    __scopeBroadcast,
  );

  const { mediaDevices, isSupported, mediaDeviceIds, requestMediaDeviceId } =
    useStore(
      broadcastContext.store,
      useShallow(
        ({ mediaDevices, __device, mediaDeviceIds, __controlsFunctions }) => ({
          mediaDevices: mediaDevices?.filter((d) => d.kind === type) ?? null,
          isSupported: __device.isMediaDevicesSupported,
          requestMediaDeviceId: __controlsFunctions.requestMediaDeviceId,
          mediaDeviceIds,
        }),
      ),
    );

  const setMediaDeviceIdComposed = useCallback(
    (deviceId: string) => {
      requestMediaDeviceId(deviceId, type);
    },
    [requestMediaDeviceId, type],
  );

  return (
    isSupported && (
      <SelectPrimitive.SelectRoot
        {...controlsProps}
        value={mediaDeviceIds[type] ?? undefined}
        onValueChange={composeEventHandlers(
          props.onValueChange,
          setMediaDeviceIdComposed,
        )}
        data-livepeer-source-select=""
        data-type={type}
      >
        {children(mediaDevices)}
      </SelectPrimitive.SelectRoot>
    )
  );
};

SourceSelect.displayName = SOURCE_SELECT_NAME;

export { SourceSelect };
export type { SourceSelectProps };
