"use client";

import * as SelectPrimitive from "../shared/Select";

// biome-ignore lint/style/useImportType: necessary import
import React, { useCallback } from "react";

import { useStore } from "zustand";
import type { MediaScopedProps } from "../shared/context";

import type {
  AudioDeviceId,
  MediaDeviceInfoExtended,
} from "@livepeer/core-web/broadcast";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Presence } from "@radix-ui/react-presence";
import { useShallow } from "zustand/react/shallow";
import type * as Radix from "../shared/primitive";
import { type BroadcastScopedProps, useBroadcastContext } from "./context";

const SOURCE_SELECT_NAME = "SourceSelect";

interface SourceSelectProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof SelectPrimitive.SelectRoot>,
    "children"
  > {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;

  /**
   * The type of media device to filter the list by.
   */
  type: "audioinput" | "videoinput";

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
  const {
    __scopeMedia,
    __scopeBroadcast,
    forceMount,
    type,
    children,
    ...controlsProps
  } = props;

  const broadcastContext = useBroadcastContext(
    SOURCE_SELECT_NAME,
    __scopeBroadcast,
  );

  const {
    video,
    audio,
    mediaDevices,
    isSupported,
    mediaDeviceIds,
    requestMediaDeviceId,
  } = useStore(
    broadcastContext.store,
    useShallow(
      ({
        video,
        audio,
        mediaDevices,
        __device,
        mediaDeviceIds,
        __controlsFunctions,
      }) => ({
        video,
        audio,
        mediaDevices: mediaDevices?.filter((d) => d.kind === type) ?? null,
        isSupported: __device.isMediaDevicesSupported,
        requestMediaDeviceId: __controlsFunctions.requestMediaDeviceId,
        mediaDeviceIds,
      }),
    ),
  );

  const setMediaDeviceIdComposed = useCallback(
    (deviceId: AudioDeviceId) => {
      requestMediaDeviceId(deviceId, type);
    },
    [requestMediaDeviceId, type],
  );

  const handleValueChange = useCallback(
    (value: AudioDeviceId) => {
      if (props.onValueChange) {
        props.onValueChange(value);
      }
      setMediaDeviceIdComposed(value);
    },
    [props.onValueChange, setMediaDeviceIdComposed],
  );

  return (
    <Presence present={forceMount || isSupported}>
      <SelectPrimitive.SelectRoot
        disabled={type === "audioinput" ? !audio : !video}
        {...controlsProps}
        value={mediaDeviceIds[type] ?? undefined}
        onValueChange={handleValueChange}
        data-livepeer-source-select=""
        data-type={type}
        data-visible={String(isSupported)}
      >
        {children(mediaDevices)}
      </SelectPrimitive.SelectRoot>
    </Presence>
  );
};

SourceSelect.displayName = SOURCE_SELECT_NAME;

export { SourceSelect };
export type { SourceSelectProps };
