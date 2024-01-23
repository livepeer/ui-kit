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

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import * as Radix from "../shared/primitive";

import React, { useEffect, useRef } from "react";

import { addMediaMetricsToStore } from "@livepeer/core-web/media";
import { MediaProvider, MediaScopedProps } from "../context";

type PlayerElement = React.ElementRef<typeof Radix.Primitive.div>;

interface PlayerProps
  extends Omit<
      Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.div>,
      "onError" | "accessKey"
    >,
    Omit<Partial<InitialProps>, "creatorId"> {
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
      style,
      ...playerProps
    } = props;

    const ref = React.useRef<PlayerElement>(null);
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
        {aspectRatio ? (
          <AspectRatio.Root
            ratio={aspectRatio}
            {...playerProps}
            ref={composedRefs}
            data-livepeer-aspect-ratio=""
          />
        ) : (
          <Radix.Primitive.div
            {...playerProps}
            ref={composedRefs}
            data-livepeer-wrapper=""
          />
        )}
      </MediaProvider>
    );
  },
);

Player.displayName = "Player";

const Root = Player;

export { Root };
export type { PlayerProps };
