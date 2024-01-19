"use client";

import {
  InitialProps,
  Src,
  createControllerStore,
  createStorage,
  version,
  MediaSizing,
} from "@livepeer/core-react";
import { getDeviceInfo } from "@livepeer/core-web/browser";

import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import type * as Radix from "@radix-ui/react-primitive";
import { useLayoutEffect } from "@radix-ui/react-use-layout-effect";

import React, { useEffect, useRef } from "react";

import { PlayerProvider, PlayerScopedProps } from "../context";
import { Primitive } from "./primitive";

type PlayerElement = React.ElementRef<typeof Primitive.div>;

interface PlayerProps
  extends Omit<Radix.ComponentPropsWithoutRef<typeof Primitive.div>, "onError">,
    Omit<Partial<InitialProps>, "creatorId"> {
  src: Src[] | string;

  /**
   * The aspect ratio of the media. Defaults to 16 / 9.
   * This significantly improves cumulative layout shift.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: number;
}

const Player = React.forwardRef<PlayerElement, PlayerProps>(
  (props: PlayerScopedProps<PlayerProps>, forwardedRef) => {
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
      ...playerProps
    } = props;

    const [mounted, setMounted] = React.useState(false);

    const ref = React.useRef<PlayerElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const heightRef = React.useRef<number | undefined>(0);
    const height = heightRef.current;
    const widthRef = React.useRef<number | undefined>(0);
    const width = widthRef.current;

    useEffect(() => {
      setMounted(true);
    }, []);

    useLayoutEffect(() => {
      const containerNode = ref.current;

      // get width and height from full dimensions
      const rect = containerNode.getBoundingClientRect();
      heightRef.current = rect.height;
      widthRef.current = rect.width;
    }, [mounted, src]);

    const store = useRef(
      createControllerStore({
        device: getDeviceInfo(version.react),
        storage: createStorage(
          typeof window !== "undefined"
            ? {
                storage: window.localStorage,
              }
            : {},
        ),
        src,
        initialProps: {
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
        },
      }),
    );

    useEffect(() => {
      if (height && width) {
        store.current.getState().__controlsFunctions.setSize({
          container: {
            width,
            height,
          },
        });
      }
    }, [height, width]);

    return (
      <PlayerProvider store={store.current} scope={props.__scopePlayer}>
        <AspectRatio.Root
          ratio={aspectRatio}
          {...playerProps}
          ref={composedRefs}
          style={{
            // biome-ignore lint/suspicious/noExplicitAny: player container css var
            ["--player-container-height" as any]: height
              ? `${height}px`
              : undefined,
            // biome-ignore lint/suspicious/noExplicitAny: player container css var
            ["--player-container-width" as any]: width
              ? `${width}px`
              : undefined,
            ...props.style,
          }}
          data-livepeer-player-wrapper=""
        />
      </PlayerProvider>
    );
  },
);

const Root = Player;

export { Root };
export type { PlayerProps };
