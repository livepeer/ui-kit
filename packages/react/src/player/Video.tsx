"use client";

import React, { useEffect } from "react";
import { useStore } from "zustand";

import { addEventListeners } from "@livepeer/core-web/browser";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { MediaScopedProps, useMediaContext } from "../context";

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
}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: MediaScopedProps<VideoProps>, forwardedRef) => {
    const { __scopeMedia, style, poster, ...videoProps } = props;

    const context = useMediaContext(VIDEO_NAME, __scopeMedia);

    const ref = React.useRef<VideoElement | null>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const { currentSource, setMounted, autoPlay, preload, thumbnailPoster } =
      useStore(
        context.store,
        useShallow(
          ({
            __controlsFunctions,
            __initialProps,
            currentSource,
            live,
            poster,
          }) => ({
            autoPlay: __initialProps.autoPlay,
            currentSource,
            live,
            preload: __initialProps.preload,
            setMounted: __controlsFunctions.setMounted,
            thumbnailPoster: poster,
          }),
        ),
      );

    useEffect(() => {
      if (ref.current) {
        const { destroy } = addEventListeners(ref.current, context.store);

        return destroy;
      }
    }, [context?.store]);

    useEffect(() => {
      // we run this on mount to initialize playback
      setMounted();
    }, [setMounted]);

    return (
      <Radix.Primitive.video
        playsInline
        poster={
          poster === null ? undefined : poster ?? thumbnailPoster ?? undefined
        }
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
