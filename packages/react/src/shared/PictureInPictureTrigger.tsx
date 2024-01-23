"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import { Presence } from "@radix-ui/react-presence";

import React from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";
import { noPropagate } from "./utils";

const PICTURE_IN_PICTURE_TRIGGER_NAME = "PictureInPictureTrigger";

type PictureInPictureTriggerElement = React.ElementRef<
  typeof Radix.Primitive.button
>;

interface PictureInPictureTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
  forceMount?: boolean;
}

const PictureInPictureTrigger = React.forwardRef<
  PictureInPictureTriggerElement,
  PictureInPictureTriggerProps
>((props: MediaScopedProps<PictureInPictureTriggerProps>, forwardedRef) => {
  const { __scopeMedia, forceMount, ...pictureInPictureProps } = props;

  const context = useMediaContext(
    PICTURE_IN_PICTURE_TRIGGER_NAME,
    __scopeMedia,
  );

  const {
    pictureInPicture,
    requestTogglePictureInPicture,
    isPictureInPictureSupported,
    fullscreen,
    title,
  } = useStore(
    context.store,
    useShallow(
      ({
        pictureInPicture,
        __controlsFunctions,
        __device,
        fullscreen,
        aria,
      }) => ({
        pictureInPicture,
        requestTogglePictureInPicture:
          __controlsFunctions.requestTogglePictureInPicture,
        isPictureInPictureSupported: __device.isPictureInPictureSupported,
        fullscreen,
        title: aria.pictureInPicture,
      }),
    ),
  );

  return (
    // do not show button if it is not supported or if currently fullscreen
    <Presence
      present={forceMount || (isPictureInPictureSupported && !fullscreen)}
    >
      <Radix.Primitive.button
        type="button"
        aria-pressed={pictureInPicture}
        aria-label={title ?? undefined}
        title={title ?? undefined}
        {...pictureInPictureProps}
        onClick={composeEventHandlers(
          props.onClick,
          noPropagate(requestTogglePictureInPicture),
        )}
        ref={forwardedRef}
        data-livepeer-controls-picture-in-picture-trigger=""
        data-picture-in-picture={String(Boolean(pictureInPicture))}
        data-visible={String(isPictureInPictureSupported && !fullscreen)}
      />
    </Presence>
  );
});

PictureInPictureTrigger.displayName = PICTURE_IN_PICTURE_TRIGGER_NAME;

export { PictureInPictureTrigger };
export type { PictureInPictureTriggerProps };
