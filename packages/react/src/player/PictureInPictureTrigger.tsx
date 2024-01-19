"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import { Presence } from "@radix-ui/react-presence";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import React, { useEffect } from "react";

import { useStore } from "zustand";
import { PlayerScopedProps, usePlayerContext } from "../context";

import * as Radix from "./primitive";
import { useShallow } from "zustand/react/shallow";

const PICTURE_IN_PICTURE_TRIGGER_NAME = "PictureInPictureTrigger";

type PictureInPictureTriggerElement = React.ElementRef<
  typeof Radix.Primitive.button
>;

interface PictureInPictureTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {
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

  const {
    pictureInPictureStore,
    requestTogglePictureInPicture,
    isPictureInPictureSupported,
    fullscreen,
  } = useStore(
    context.store,
    useShallow(
      ({ pictureInPicture, __controlsFunctions, __device, fullscreen }) => ({
        pictureInPictureStore: pictureInPicture,
        requestTogglePictureInPicture:
          __controlsFunctions.requestTogglePictureInPicture,
        isPictureInPictureSupported: __device.isPictureInPictureSupported,
        fullscreen,
      }),
    ),
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
    () => requestTogglePictureInPicture(),
    [requestTogglePictureInPicture],
  );

  const title = React.useMemo(
    () => (pictureInPicture ? "Exit mini player (i)" : "Mini player (i)"),
    [pictureInPicture],
  );

  return (
    // do not show button if it is not supported or if currently fullscreen
    <Presence
      present={forceMount || (isPictureInPictureSupported && !fullscreen)}
    >
      <Radix.Primitive.button
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
