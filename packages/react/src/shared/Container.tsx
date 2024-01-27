"use client";

import React from "react";

import * as RadixAspectRatio from "@radix-ui/react-aspect-ratio";
import { useStore } from "zustand";
import { useShallow } from "zustand/react/shallow";
import { MediaScopedProps, useMediaContext } from "../context";
import * as Radix from "./primitive";

const CONTAINER_NAME = "Container";

type ContainerElement = React.ElementRef<typeof Radix.Primitive.div>;
type ContainerProps = Radix.ComponentPropsWithoutRef<
  typeof Radix.Primitive.div
>;

const Container = React.memo(
  React.forwardRef<ContainerElement, MediaScopedProps<ContainerProps>>(
    (props, forwardedRef) => {
      const { __scopeMedia, ...aspectRatioProps } = props;

      const context = useMediaContext(CONTAINER_NAME, __scopeMedia);

      const {
        aspectRatio,
        fullscreen,
        playing,
        canPlay,
        rate,
        error,
        live,
        hasPlayed,
        hidden,
        pictureInPicture,
        loading,
        videoQuality,
      } = useStore(
        context.store,
        useShallow(
          ({
            __initialProps,
            fullscreen,
            playing,
            canPlay,
            playbackRate,
            error,
            live,
            hasPlayed,
            hidden,
            pictureInPicture,
            loading,
            videoQuality,
          }) => ({
            aspectRatio: __initialProps.aspectRatio,
            fullscreen,
            playing,
            canPlay,
            error: Boolean(error),
            rate:
              playbackRate === "constant"
                ? "constant"
                : playbackRate > 1
                  ? "fast"
                  : playbackRate < 1
                    ? "slow"
                    : "normal",
            live,
            hasPlayed,
            hidden,
            pictureInPicture,
            loading,
            videoQuality,
          }),
        ),
      );

      return aspectRatio ? (
        <RadixAspectRatio.Root
          ratio={aspectRatio}
          {...aspectRatioProps}
          ref={forwardedRef}
          data-livepeer-aspect-ratio=""
          data-fullscreen={String(fullscreen)}
          data-playing={String(playing)}
          data-can-play={String(canPlay)}
          data-playback-rate={rate}
          data-error={String(error)}
          data-loading={String(loading)}
          data-live={String(live)}
          data-has-played={String(hasPlayed)}
          data-controls-hidden={String(hidden)}
          data-picture-in-picture={String(pictureInPicture)}
          data-video-quality={String(videoQuality)}
        />
      ) : (
        <Radix.Primitive.div
          {...aspectRatioProps}
          ref={forwardedRef}
          data-livepeer-wrapper=""
          data-fullscreen={String(fullscreen)}
          data-playing={String(playing)}
          data-can-play={String(canPlay)}
          data-playback-rate={rate}
          data-error={String(error)}
          data-loading={String(loading)}
          data-live={String(live)}
          data-has-played={String(hasPlayed)}
          data-controls-hidden={String(hidden)}
          data-picture-in-picture={String(pictureInPicture)}
          data-video-quality={String(videoQuality)}
        />
      );
    },
  ),
);

Container.displayName = CONTAINER_NAME;

export { Container, type ContainerProps };
