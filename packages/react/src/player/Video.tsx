"use client";

import React, { useEffect } from "react";
import { useStore } from "zustand";

import { type HlsConfig, addEventListeners } from "@livepeer/core-web/browser";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { type MediaScopedProps, useMediaContext } from "../shared/context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "../shared/primitive";

const VIDEO_NAME = "Video";

type OmittedProps = "src" | "poster" | "autoPlay" | "preload";

type VideoElement = React.ElementRef<typeof Radix.Primitive.video>;

interface VideoProps
  extends Omit<
    Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.video>,
    OmittedProps
  > {
  /**
   * Controls the poster source, which by default uses the thumbnail from the Src input.
   *
   * Set to null to disable the default poster image from the Src.
   */
  poster?: string | null;

  /**
   * Configures the HLS.js options, for advanced usage of the Player.
   */
  hlsConfig?: HlsConfig;
}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: MediaScopedProps<VideoProps>, forwardedRef) => {
    const { __scopeMedia, style, poster, hlsConfig, ...videoProps } = props;

    const context = useMediaContext(VIDEO_NAME, __scopeMedia);

    const ref = React.useRef<VideoElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const {
      currentSource,
      setMounted,
      autoPlay,
      preload,
      thumbnailPoster,
      volume,
      requestToggleMute,
    } = useStore(
      context.store,
      useShallow(
        ({
          __controlsFunctions,
          __initialProps,
          currentSource,
          live,
          poster,
          volume,
        }) => ({
          autoPlay: __initialProps.autoPlay,
          currentSource,
          live,
          preload: __initialProps.preload,
          setMounted: __controlsFunctions.setMounted,
          thumbnailPoster: poster,
          volume,
          requestToggleMute: __controlsFunctions.requestToggleMute,
        }),
      ),
    );

    useEffect(() => {
      if (ref.current) {
        const { destroy } = addEventListeners(ref.current, context.store);

        return destroy;
      }
    }, [context?.store]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: only set once to prevent flashing
    useEffect(() => {
      if (hlsConfig) {
        context.store.getState().__controlsFunctions.setHlsConfig(hlsConfig);
      }
    }, []);

    useEffect(() => {
      // we run this on mount to initialize playback
      setMounted();
    }, [setMounted]);

    useEffect(() => {
      if (typeof videoProps.muted !== "undefined") {
        requestToggleMute(videoProps.muted);
      }
    }, [videoProps.muted, requestToggleMute]);

    return (
      <Radix.Primitive.video
        playsInline
        poster={
          poster === null ? undefined : poster ?? thumbnailPoster ?? undefined
        }
        muted={volume === 0}
        {...videoProps}
        autoPlay={autoPlay}
        preload={preload}
        ref={composedRefs}
        data-livepeer-video=""
        data-livepeer-source-type={currentSource?.type ?? "none"}
        style={{
          ...style,
          // ensures video expands in ratio
          position: "absolute",
          inset: 0,
        }}
      />
    );
  },
);

Video.displayName = VIDEO_NAME;

export { Video };
export type { VideoProps };
