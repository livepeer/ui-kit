"use client";

import React from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";
import * as Radix from "../shared/primitive";

const POSTER_NAME = "Poster";

type PosterElement = React.ElementRef<typeof Radix.Primitive.img>;

interface PosterProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.img> {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true;
}

const Poster = React.forwardRef<PosterElement, PosterProps>(
  (props: MediaScopedProps<PosterProps>, forwardedRef) => {
    const { __scopeMedia, forceMount, src, ...posterProps } = props;

    const context = useMediaContext(POSTER_NAME, __scopeMedia);

    const thumbnail = useStore(context.store, ({ thumbnail }) => thumbnail);

    return (
      <Presence present={forceMount || Boolean(src || thumbnail?.src)}>
        <Radix.Primitive.img
          alt="Poster for video"
          aria-hidden="true"
          {...posterProps}
          src={src || thumbnail?.src}
          ref={forwardedRef}
          data-livepeer-poster=""
          data-visible={String(Boolean(src || thumbnail?.src))}
        />
      </Presence>
    );
  },
);

Poster.displayName = POSTER_NAME;

export { Poster };
export type { PosterProps };
