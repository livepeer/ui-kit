"use client";

import {
  type MediaScopedProps,
  useMediaContext,
  useStore,
} from "@livepeer/react/player";
import { useEffect, useRef } from "react";

interface PlayerEventDetail {
  type: string;
  message: string;
  error?: unknown;
}

function dispatchPlayerEvent(type: string, detail?: PlayerEventDetail) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(type, { detail }));
  }
}

export function PlayerErrorMonitor({
  __scopeMedia,
}: MediaScopedProps<Record<string, never>>) {
  const context = useMediaContext("PlayerErrorMonitor", __scopeMedia);
  const previousError = useRef<unknown>(null);

  const { error } = useStore(context.store, ({ error }) => ({
    error,
  }));

  useEffect(() => {
    if (error && error !== previousError.current) {
      previousError.current = error;

      let errorType = "general";
      let message = "Player error occurred";

      const errorObj = error as { type?: string };

      if (errorObj.type === "offline") {
        errorType = "offline";
        message = "Stream is offline";
        dispatchPlayerEvent("lvpr-player-offline", {
          type: errorType,
          message,
          error,
        });
      } else if (errorObj.type === "access-control") {
        errorType = "access-control";
        message = "Stream is private - access denied";
        dispatchPlayerEvent("lvpr-player-access-control", {
          type: errorType,
          message,
          error,
        });
      } else {
        dispatchPlayerEvent("lvpr-player-error", {
          type: errorType,
          message,
          error,
        });
      }
    }
  }, [error]);

  return null;
}
