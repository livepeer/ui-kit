"use client";

import { toast } from "sonner";

import * as Assets from "@livepeer/react/assets";
import * as Player from "@livepeer/react/player";

import { ClipPayload } from "livepeer/dist/models/components";
import { useCallback, useTransition } from "react";
import { createClip } from "./actions";

export function ClipForm({ className }: { className?: string }) {
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
              href={`https://lvpr.tv?v=${result.data}`}
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
        className="hover:scale-110 h-full w-full transition-all flex-shrink-0"
      >
        {isPending ? (
          <Assets.LoadingIcon className="h-full w-full animate-spin" />
        ) : (
          <Assets.ClipIcon className="w-full h-full" />
        )}
      </Player.ClipTrigger>
    </Player.LiveIndicator>
  );
}
