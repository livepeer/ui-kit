import { toast } from "sonner";

import * as Player from "@livepeer/react/player";

import { ClipIcon, LoadingIcon } from "@livepeer/react/assets";
import type { ClipPayload } from "livepeer/models/components";
import { useCallback, useState } from "react";

export function Clip({ className }: { className?: string }) {
  const [pending, setIsPending] = useState(false);

  const createClipComposed = useCallback(async (opts: ClipPayload) => {
    setIsPending(true);
    try {
      const result = await fetch("/api/clip", {
        method: "POST",
        body: JSON.stringify(opts),
        headers: {
          "content-type": "application/json",
        },
      });

      if (result.ok) {
        const response = await result.json();

        toast.success(
          <span>
            {
              "You have created a new clip - in a few minutes, you will be able to view it at "
            }
            <a
              href={`https://lvpr.tv?v=${response.playbackId}`}
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsPending(false);
    }
  }, []);

  return (
    <Player.LiveIndicator className={className} asChild>
      <Player.ClipTrigger
        onClip={createClipComposed}
        disabled={pending}
        className="hover:scale-110 transition-all flex-shrink-0"
      >
        {pending ? (
          <LoadingIcon className="h-full w-full animate-spin" />
        ) : (
          <ClipIcon className="w-full h-full" />
        )}
      </Player.ClipTrigger>
    </Player.LiveIndicator>
  );
}
