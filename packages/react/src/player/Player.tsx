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

import React, { PropsWithChildren, useEffect, useRef } from "react";

import { addMediaMetricsToStore } from "@livepeer/core-web/media";
import { MediaProvider, MediaScopedProps } from "../context";

interface PlayerProps
  extends PropsWithChildren<Omit<Partial<InitialProps>, "creatorId">> {
  /**
   * The source for the Player. The `Src[]` can be created from calling `getSrc`
   * with the response from the playback info API, or a string or array of string
   * source URLs.
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
}

const Player = React.memo((props: MediaScopedProps<PlayerProps>) => {
  const { aspectRatio = 16 / 9, src, children, ...rest } = props;

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
        ...rest,
      },
    }),
  );

  useEffect(() => {
    return () => {
      store?.current?.destroy?.();
    };
  }, []);

  useEffect(() => {
    const metrics = addMediaMetricsToStore(store.current.store);

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
