"use client";

import React, { type PropsWithChildren, useEffect, useRef } from "react";

import {
  type InitialBroadcastProps,
  createBroadcastStore,
  getBroadcastDeviceInfo,
} from "@livepeer/core-web/broadcast";
import { getDeviceInfo } from "@livepeer/core-web/browser";
import {
  type InitialProps,
  addMediaMetricsToStore,
  createControllerStore,
} from "@livepeer/core/media";
import { createStorage, noopStorage } from "@livepeer/core/storage";
import { version } from "@livepeer/core/version";
import { MediaProvider, type MediaScopedProps } from "../shared/context";
import { BroadcastProvider, type BroadcastScopedProps } from "./context";

interface BroadcastProps
  extends PropsWithChildren<
    Omit<Partial<InitialBroadcastProps>, "aspectRatio" | "ingestUrl"> &
      Pick<
        Partial<InitialProps>,
        "onError" | "storage" | "timeout" | "videoQuality"
      >
  > {
  /**
   * The WHIP WebRTC ingest URL for the Broadcast. The ingestUrl can be created using `getIngest`
   * from a string (assumed to be stream keys or URLs), Cloudflare stream data, Cloudflare URL data,
   * or Livepeer stream data.
   */
  ingestUrl: string | null;

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
    ingestUrl,
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
      ingestUrl,
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
    if (ingestUrl) {
      broadcastStore.current.store
        .getState()
        .__controlsFunctions.setIngestUrl(ingestUrl);
    }
  }, [ingestUrl]);

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
