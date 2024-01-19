"use client";

import React from "react";

import { Presence } from "@radix-ui/react-presence";
import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import * as Radix from "./primitive";

const POSTER_NAME = "Poster";

type PosterElement = React.ElementRef<typeof Radix.Primitive.img>;

interface PosterProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.img> {
  forceMount?: boolean;
}

const Poster = React.forwardRef<PosterElement, PosterProps>(
  (props: PlayerScopedProps<PosterProps>, forwardedRef) => {
    const { __scopePlayer, forceMount, src, ...posterProps } = props;

    const context = usePlayerContext(POSTER_NAME, __scopePlayer);

    const thumbnail = useStore(context.store, ({ thumbnail }) => thumbnail);

    return (
      <Presence present={Boolean(forceMount || src || thumbnail?.src)}>
        <Radix.Primitive.img
          alt="Poster for video"
          aria-hidden="true"
          {...posterProps}
          src={src || thumbnail?.src}
          ref={forwardedRef}
          data-livepeer-player-poster=""
        />
      </Presence>
    );
  },
);

export { Poster };
export type { PosterProps };
