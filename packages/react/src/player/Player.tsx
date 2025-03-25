"use client";

import { getDeviceInfo } from "@livepeer/core-web/browser";

import React, { useEffect, useRef, type PropsWithChildren } from "react";

import {
  type InitialProps,
  type Src,
  addLegacyMediaMetricsToStore,
  addMetricsToStore,
  createControllerStore,
} from "@livepeer/core/media";
import type { PlaybackEvent } from "@livepeer/core/media";
import { createStorage, noopStorage } from "@livepeer/core/storage";
import { version } from "@livepeer/core/version";
import { MediaProvider, type MediaScopedProps } from "../shared/context";

interface PlayerProps
  extends PropsWithChildren<
    Omit<Partial<InitialProps>, "creatorId" | "hotkeys">
  > {
  /**
   * The source for the Player. The `Src[]` can be created from calling `getSrc`
   * with Livepeer playback info, Cloudflare stream data, Mux URLs, `string[]`, or `string`.
   */
  src: Src[] | null;

  /**
   * The aspect ratio of the media. Defaults to 16 / 9.
   * This significantly improves cumulative layout shift.
   * Set to `null` to render a plain div primitive.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: number | null;

  /**
   * Whether hotkeys are enabled. Defaults to `true`. Allows users to use keyboard shortcuts for player control.
   *
   * This is highly recommended to adhere to ARIA guidelines.
   */
  hotkeys?: boolean;

  /**
   * A callback that is called when the player's metrics events are emitted.
   * This can be used to integrate with other analytics providers.
   */
  // biome-ignore lint/suspicious/noExplicitAny: allow any for incoming callback
  onPlaybackEvents?: (events: PlaybackEvent[]) => Promise<any> | any;

  /**
   * The interval at which metrics are sent, in ms. Defaults to 5000.
   */
  metricsInterval?: number;

  /**
   * The ICE servers to use.
   *
   * If not provided, the default ICE servers will be used.
   */
  iceServers?: RTCIceServer | RTCIceServer[];
}

const Player = React.memo((props: MediaScopedProps<PlayerProps>) => {
  const {
    aspectRatio = 16 / 9,
    src,
    children,
    jwt,
    accessKey,
    storage,
    onPlaybackEvents,
    metricsInterval,
    ...rest
  } = props;

  const store = useRef(
    createControllerStore({
      device: getDeviceInfo(version.react),
      storage:
        storage ??
        createStorage(
          storage !== null && typeof window !== "undefined"
            ? {
                storage: window.localStorage,
              }
            : {
                storage: noopStorage,
              },
        ),
      src,
      initialProps: {
        aspectRatio,
        jwt,
        accessKey,
        ...rest,
      },
    }),
  );

  useEffect(() => {
    if (jwt) {
      store?.current?.store.setState((prev) => ({
        __initialProps: {
          ...prev.__initialProps,
          jwt,
        },
      }));
    }
  }, [jwt]);

  useEffect(() => {
    if (accessKey) {
      store?.current?.store.setState((prev) => ({
        __initialProps: {
          ...prev.__initialProps,
          accessKey,
        },
      }));
    }
  }, [accessKey]);

  useEffect(() => {
    return () => {
      store?.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    const metrics = addLegacyMediaMetricsToStore(store.current.store);

    return () => {
      metrics.destroy();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: no deps
  useEffect(() => {
    const metrics = addMetricsToStore(store.current.store, {
      onPlaybackEvents,
      interval: metricsInterval,
    });

    return () => {
      metrics.destroy();
    };
  }, []);

  return (
    <MediaProvider store={store.current.store} scope={props.__scopeMedia}>
      {children}
    </MediaProvider>
  );
});

Player.displayName = "Player";

const Root = Player;

export { Root };
export type { PlayerProps };
