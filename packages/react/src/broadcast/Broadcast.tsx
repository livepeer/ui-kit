"use client";

import {
  createControllerStore,
  createStorage,
  noopStorage,
  version,
} from "@livepeer/core";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import * as Radix from "../shared/primitive";

import React, { PropsWithChildren, useEffect, useRef } from "react";

import {
  InitialBroadcastProps,
  createBroadcastStore,
} from "@livepeer/core-web/broadcast";
import { getDeviceInfo } from "@livepeer/core-web/browser";
import { addMediaMetricsToStore } from "@livepeer/core-web/media";
import { MediaProvider, MediaScopedProps } from "../context";
import { BroadcastProvider, BroadcastScopedProps } from "./context";

type BroadcastElement = React.ElementRef<typeof Radix.Primitive.div>;

interface BroadcastProps
  extends PropsWithChildren<
    Omit<Partial<InitialBroadcastProps>, "streamKey" | "aspectRatio">
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

const Broadcast = React.forwardRef<BroadcastElement, BroadcastProps>(
  (
    props: MediaScopedProps<BroadcastScopedProps<BroadcastProps>>,
    forwardedRef,
  ) => {
    const {
      aspectRatio = 16 / 9,
      streamKey,
      ingestUrl,
      volume = 0,
      forceEnabled,
      children,
    } = props;

    const ref = React.useRef<BroadcastElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const store = useRef(
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
          aspectRatio,
          volume,
        },
      }),
    );

    const broadcastStore = useRef(
      createBroadcastStore({
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
        initialProps: {
          aspectRatio,
          forceEnabled,
          streamKey,
          ingestUrl,
          volume,
        },
      }),
    );

    useEffect(() => {
      const metrics = addMediaMetricsToStore(store.current);

      return () => {
        metrics.destroy();
      };
    }, []);

    return (
      <MediaProvider store={store.current} scope={props.__scopeMedia}>
        <BroadcastProvider
          store={broadcastStore.current}
          scope={props.__scopeBroadcast}
        >
          {children}
        </BroadcastProvider>
      </MediaProvider>
    );
  },
);

Broadcast.displayName = "Broadcast";

const Root = Broadcast;

export { Root };
export type { BroadcastProps };
