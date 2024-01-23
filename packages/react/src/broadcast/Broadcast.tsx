"use client";

import {
  createControllerStore,
  createStorage,
  noopStorage,
  version,
} from "@livepeer/core";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import * as Radix from "../shared/primitive";

import React, { useEffect, useRef } from "react";

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
  extends Omit<
      Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div>,
      "onError" | "accessKey"
    >,
    Omit<Partial<InitialBroadcastProps>, "streamKey" | "aspectRatio"> {
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
      volume,
      style,
      ...broadcastProps
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
          streamKey,
          ingestUrl: ingestUrl,
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
          {aspectRatio ? (
            <AspectRatio.Root
              ratio={aspectRatio}
              {...broadcastProps}
              ref={composedRefs}
              data-livepeer-aspect-ratio=""
            />
          ) : (
            <Radix.Primitive.div
              {...broadcastProps}
              ref={composedRefs}
              data-livepeer-wrapper=""
            />
          )}
        </BroadcastProvider>
      </MediaProvider>
    );
  },
);

Broadcast.displayName = "Broadcast";

const Root = Broadcast;

export { Root };
export type { BroadcastProps };
