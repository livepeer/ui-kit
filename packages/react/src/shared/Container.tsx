"use client";

import React from "react";

import * as RadixAspectRatio from "@radix-ui/react-aspect-ratio";
import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";
import * as Radix from "./primitive";

const CONTAINER_NAME = "Container";

type ContainerElement = React.ElementRef<typeof Radix.Primitive.div>;
type ContainerProps = Radix.ComponentPropsWithoutRef<
  typeof Radix.Primitive.div
>;

const Container = React.forwardRef<
  ContainerElement,
  MediaScopedProps<ContainerProps>
>((props, forwardedRef) => {
  const { __scopeMedia, ...aspectRatioProps } = props;

  const context = useMediaContext(CONTAINER_NAME, __scopeMedia);

  const aspectRatio = useStore(
    context.store,
    ({ __initialProps }) => __initialProps.aspectRatio,
  );

  return aspectRatio ? (
    <RadixAspectRatio.Root
      ratio={aspectRatio}
      {...aspectRatioProps}
      ref={forwardedRef}
      data-livepeer-aspect-ratio=""
    />
  ) : (
    <Radix.Primitive.div
      {...aspectRatioProps}
      ref={forwardedRef}
      data-livepeer-wrapper=""
    />
  );
});

Container.displayName = CONTAINER_NAME;

export { Container, type ContainerProps };
