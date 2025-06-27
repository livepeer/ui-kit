"use client";

import { ClipIcon, LoadingIcon } from "@livepeer/react/assets";

import * as Player from "@livepeer/react/player";
import type { ClipPayload } from "livepeer/models/components";
import { useCallback, useTransition } from "react";
import { toast } from "sonner";
import { createClip } from "./actions";

export function Clip({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  const createClipComposed = useCallback((opts: ClipPayload) => {
    startTransition(async () => {
      const result = await createClip(opts);

      if (result.success) {
        toast.success(
          <span>
            {
              "You have created a new clip - in a few minutes, you will be able to view it at "
            }
            <a
              href={`/?v=${result.playbackId}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold"
            >
              this link
            </a>
            {"."}
          </span>,
        );
      } else {
        toast.error(
          "Failed to create a clip. Please try again in a few seconds.",
        );
      }
    });
  }, []);

  return (
    <Player.LiveIndicator className={className} asChild>
      <Player.ClipTrigger
        onClip={createClipComposed}
        disabled={isPending}
        className="hover:scale-110 transition-all flex-shrink-0"
      >
        {isPending ? (
          <LoadingIcon className="h-full w-full animate-spin" />
        ) : (
          <ClipIcon className="w-full h-full" />
        )}
      </Player.ClipTrigger>
    </Player.LiveIndicator>
  );
}
