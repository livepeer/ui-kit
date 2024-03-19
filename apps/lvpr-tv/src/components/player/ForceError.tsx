"use client";

import { cn } from "@/lib/utils";
import {
  type MediaScopedProps,
  useMediaContext,
  useStore,
} from "@livepeer/react/player";

const FORCE_ERROR_NAME = "ForceError";

export function ForceError({
  className,
  __scopeMedia,
}: MediaScopedProps<{ className?: string }>) {
  const context = useMediaContext(FORCE_ERROR_NAME, __scopeMedia);

  const { onError } = useStore(context.store, ({ __controlsFunctions }) => ({
    onError: __controlsFunctions.onError,
  }));

  return (
    <button
      className={cn(
        "bg-white/10 text-sm rounded-md hover:bg-white/20 px-3 py-2",
        className,
      )}
      title="Simulate a playback error in the video element above"
      type="button"
      onClick={() =>
        onError(
          new Error(
            "This is a simulated error, to show how fallback works when errors are encountered in playback.",
          ),
        )
      }
    >
      Simulate a playback error
    </button>
  );
}
