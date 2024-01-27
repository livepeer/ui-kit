"use client";

import { composeEventHandlers } from "@radix-ui/primitive";

import React from "react";

import { useStore } from "zustand";
import { MediaScopedProps, useMediaContext } from "../context";

import { useShallow } from "zustand/react/shallow";
import * as Radix from "./primitive";
import { noPropagate } from "./utils";

const MUTE_TRIGGER_NAME = "MuteTrigger";

type MuteTriggerElement = React.ElementRef<typeof Radix.Primitive.button>;

interface MuteTriggerProps
  extends Radix.ComponentPropsWithoutRef<typeof Radix.Primitive.button> {}

const MuteTrigger = React.forwardRef<MuteTriggerElement, MuteTriggerProps>(
  (props: MediaScopedProps<MuteTriggerProps>, forwardedRef) => {
    const { __scopeMedia, ...playProps } = props;

    const context = useMediaContext(MUTE_TRIGGER_NAME, __scopeMedia);

    const { muted, toggleMute } = useStore(
      context.store,
      useShallow(({ __controls, __controlsFunctions }) => ({
        muted: __controls.muted,
        toggleMute: __controlsFunctions.requestToggleMute,
      })),
    );

    const title = React.useMemo(
      () => (muted ? "Unmute (m)" : "Mute (m)"),
      [muted],
    );

    return (
      <Radix.Primitive.button
        type="button"
        aria-pressed={muted}
        aria-label={title}
        title={title}
        {...playProps}
        onClick={composeEventHandlers(props.onClick, noPropagate(toggleMute))}
        ref={forwardedRef}
        data-livepeer-controls-mute-trigger=""
        data-muted={String(muted)}
      />
    );
  },
);

MuteTrigger.displayName = MUTE_TRIGGER_NAME;

export { MuteTrigger };
export type { MuteTriggerProps };
