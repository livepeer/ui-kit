"use client";

import {
  MediaScopedProps,
  useMediaContext,
  useStore,
} from "@livepeer/react/context";

const CURRENT_SOURCE_NAME = "CurrentSource";

export function CurrentSource({
  className,
  __scopeMedia,
}: MediaScopedProps<{ className?: string }>) {
  const context = useMediaContext(CURRENT_SOURCE_NAME, __scopeMedia);

  const { currentSource } = useStore(context.store, ({ currentSource }) => ({
    currentSource,
  }));

  return currentSource ? (
    <div className={className}>
      <div className="flex gap-4 select-none items-center group">
        <span className="flex-shrink-0 line-clamp-1">Playback type:</span>
        <span className="text-xs text-white/80">{currentSource?.type}</span>
      </div>
      <div className="flex gap-4 select-none items-center group">
        <span className="flex-shrink-0 line-clamp-1">Source path:</span>
        <span className="text-xs text-white/80 line-clamp-1">
          {new URL(currentSource.src)?.pathname +
            new URL(currentSource.src)?.search}
        </span>
      </div>
    </div>
  ) : null;
}
