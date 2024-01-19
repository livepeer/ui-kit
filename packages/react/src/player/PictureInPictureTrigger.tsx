"use client";

import type * as Radix from "@radix-ui/react-primitive";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Presence } from "@radix-ui/react-presence";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import React, { useEffect } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";
import { Primitive } from "./primitive";

const PICTURE_IN_PICTURE_TRIGGER_NAME = "PictureInPictureTrigger";

type PictureInPictureTriggerElement = React.ElementRef<typeof Primitive.button>;

interface PictureInPictureTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.button> {
  pictureInPicture?: boolean;
  onPictureInPictureChange?(pictureInPicture: boolean): void;
  forceMount?: boolean;
}

const PictureInPictureTrigger = React.forwardRef<
  PictureInPictureTriggerElement,
  PictureInPictureTriggerProps
>((props: PlayerScopedProps<PictureInPictureTriggerProps>, forwardedRef) => {
  const {
    __scopePlayer,
    pictureInPicture: pictureInPictureProp,
    onPictureInPictureChange,
    forceMount,
    ...pictureInPictureProps
  } = props;

  const context = usePlayerContext(
    PICTURE_IN_PICTURE_TRIGGER_NAME,
    __scopePlayer,
  );

  const { pictureInPictureStore, __controlsFunctions, __device, fullscreen } =
    useStore(
      context.store,
      ({ pictureInPicture, __controlsFunctions, __device, fullscreen }) => ({
        pictureInPictureStore: pictureInPicture,
        __controlsFunctions,
        __device,
        fullscreen,
      }),
    );

  const [pictureInPicture = false, setPictureInPicture] = useControllableState({
    prop: pictureInPictureProp,
    defaultProp: false,
    onChange: onPictureInPictureChange,
  });

  useEffect(() => {
    setPictureInPicture(pictureInPictureStore);
  }, [setPictureInPicture, pictureInPictureStore]);

  const togglePictureInPicture = React.useCallback(
    () => __controlsFunctions.requestTogglePictureInPicture(),
    [__controlsFunctions],
  );

  const title = React.useMemo(
    () => (pictureInPicture ? "Exit mini player (i)" : "Mini player (i)"),
    [pictureInPicture],
  );

  return (
    // do not show button if it is not supported or if currently fullscreen
    <Presence
      present={
        forceMount || (__device.isPictureInPictureSupported && !fullscreen)
      }
    >
      <Primitive.button
        type="button"
        aria-pressed={pictureInPicture}
        aria-label={title}
        title={title}
        {...pictureInPictureProps}
        onClick={composeEventHandlers(props.onClick, togglePictureInPicture)}
        ref={forwardedRef}
        data-livepeer-player-controls-picture-in-picture-button=""
        data-picture-in-picture={pictureInPicture}
      />
    </Presence>
  );
});

export { PictureInPictureTrigger };
export type { PictureInPictureTriggerProps };
