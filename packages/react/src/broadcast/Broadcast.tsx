"use client";

import React, { PropsWithChildren, useEffect, useRef } from "react";

import {
  InitialBroadcastProps,
  createBroadcastStore,
  getBroadcastDeviceInfo,
} from "@livepeer/core-web/broadcast";
import { getDeviceInfo } from "@livepeer/core-web/browser";
import {
  InitialProps,
  addMediaMetricsToStore,
  createControllerStore,
} from "@livepeer/core/media";
import { createStorage, noopStorage } from "@livepeer/core/storage";
import { version } from "@livepeer/core/version";
import { MediaProvider, MediaScopedProps } from "../shared/context";
import { BroadcastProvider, BroadcastScopedProps } from "./context";

interface BroadcastProps
  extends PropsWithChildren<
    Omit<Partial<InitialBroadcastProps>, "aspectRatio"> &
      Pick<
        Partial<InitialProps>,
        "onError" | "storage" | "timeout" | "videoQuality"
      >
  > {
  /**
   * The stream key to use for the broadcast.
   */
  streamKey: string;

  /**
   * The aspect ratio of the media. Defaults to 16 / 9.
   * This significantly improves cumulative layout shift.
   * Set to `null` to render a plain div primitive.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: number | null;
}

const Broadcast = (
  props: MediaScopedProps<BroadcastScopedProps<BroadcastProps>>,
) => {
  const {
    aspectRatio = 16 / 9,
    children,
    streamKey,
    onError,
    storage,
    timeout,
    videoQuality,
    ...rest
  } = props;

  const mediaStore = useRef(
    createControllerStore({
      device: getDeviceInfo(version.react),
      storage: createStorage(
        typeof window !== "undefined"
          ? {
              storage: window.localStorage,
            }
          : {
              storage: noopStorage,
            },
      ),
      src: null,
      initialProps: {
        hotkeys: "broadcast",
        aspectRatio,
        volume: 0,
        onError,
        storage,
        timeout,
        videoQuality,
      },
    }),
  );

  const broadcastStore = useRef(
    createBroadcastStore({
      device: getBroadcastDeviceInfo(version.react),
      storage: createStorage(
        typeof window !== "undefined"
          ? {
              storage: window.localStorage,
            }
          : {
              storage: noopStorage,
            },
      ),
      streamKey,
      initialProps: {
        aspectRatio,
        ...rest,
      },
    }),
  );

  useEffect(() => {
    return () => {
      mediaStore?.current?.destroy?.();
      broadcastStore?.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    if (streamKey) {
      broadcastStore.current.store
        .getState()
        .__controlsFunctions.setStreamKey(streamKey);
    }
  }, [streamKey]);

  useEffect(() => {
    const metrics = addMediaMetricsToStore(mediaStore.current.store);

    return () => {
      metrics.destroy();
    };
  }, []);

  return (
    <MediaProvider store={mediaStore.current.store} scope={props.__scopeMedia}>
      <BroadcastProvider
        store={broadcastStore.current.store}
        scope={props.__scopeBroadcast}
      >
        {children}
      </BroadcastProvider>
    </MediaProvider>
  );
};

Broadcast.displayName = "Broadcast";

const Root = Broadcast;

export { Root };
export type { BroadcastProps };