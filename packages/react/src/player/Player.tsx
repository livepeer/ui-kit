"use client";

import {
  InitialProps,
  Src,
  createControllerStore,
  createStorage,
  noopStorage,
  version,
} from "@livepeer/core";
import { getDeviceInfo } from "@livepeer/core-web/browser";

import * as Radix from "../shared/primitive";

import React, { PropsWithChildren, useEffect, useRef } from "react";

import { addMediaMetricsToStore } from "@livepeer/core-web/media";
import { MediaProvider, MediaScopedProps } from "../context";

type PlayerElement = React.ElementRef<typeof Radix.Primitive.div>;

interface PlayerProps
  extends PropsWithChildren<Omit<Partial<InitialProps>, "creatorId">> {
  /**
   * The source for the Player. The `Src[]` can be created from calling `parsePlaybackInfo`
   * with the response from the playback info API.
   */
  src: Src[] | string;

  /**
   * The aspect ratio of the media. Defaults to 16 / 9.
   * This significantly improves cumulative layout shift.
   * Set to `null` to render a plain div primitive.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: number | null;
}

const Player = React.forwardRef<PlayerElement, PlayerProps>(
  (props: MediaScopedProps<PlayerProps>, forwardedRef) => {
    const {
      aspectRatio = 16 / 9,
      src,
      autoPlay,
      preload,
      viewerId,
      volume,
      playbackRate,
      lowLatency,
      loop,
      jwt,
      accessKey,
      onError,
      clipLength,
      children,
    } = props;

    const ref = React.useRef<PlayerElement>(null);

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
        src,
        initialProps: {
          aspectRatio,
          autoPlay,
          preload,
          viewerId,
          volume,
          playbackRate,
          lowLatency,
          onError,
          loop,
          jwt,
          accessKey,
          clipLength,
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
        {children}
      </MediaProvider>
    );
  },
);

Player.displayName = "Player";

const Root = Player;

export { Root };
export type { PlayerProps };
