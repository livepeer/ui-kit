"use client";

import type * as Radix from "@radix-ui/react-primitive";

import React, { useEffect } from "react";
import { useStore } from "zustand";

import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";
import { addMediaMetricsToStore } from "@livepeer/core-web/media";
import { addEventListeners } from "@livepeer/core-web/browser";
import { useComposedRefs } from "@radix-ui/react-compose-refs";

const VIDEO_NAME = "PlayerVideo";

type VideoElement = React.ElementRef<typeof Primitive.video>;

interface VideoProps
  extends Omit<Radix.ComponentPropsWithoutRef<typeof Primitive.video>, "src"> {}

const Video = React.forwardRef<VideoElement, VideoProps>(
  (props: PlayerScopedProps<VideoProps>, forwardedRef) => {
    const { __scopePlayer, style, ...contentProps } = props;

    const context = usePlayerContext(VIDEO_NAME, __scopePlayer);

    const ref = React.useRef<VideoElement>(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);

    const { currentSource, __initialProps } = useStore(
      context.store,
      ({ currentSource, __initialProps }) => ({
        currentSource,
        __initialProps,
      }),
    );

    useEffect(() => {
      const { destroy } = addEventListeners(ref.current, context.store);

      return destroy;
    }, [context]);

    return (
      <Primitive.video
        src={currentSource?.src}
        autoPlay={__initialProps.autoPlay}
        loop={__initialProps.loop}
        {...contentProps}
        ref={composedRefs}
        style={{
          ...style,
          // ensures video expands in ratio
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
    );
  },
);

export { Video };
export type { VideoProps };
