"use server";

import { livepeer } from "@/lib/livepeer";
import type { ClipPayload } from "livepeer/models/components";

export const createClip = async (opts: ClipPayload) => {
  try {
    const result = await livepeer.stream.createClip({
      ...opts,
    });

    if (!result.data?.asset?.playbackId) {
      return { success: false, error: "PLAYBACK_ID_MISSING" } as const;
    }

    return {
      success: true,
      playbackId: result.data?.asset?.playbackId,
    } as const;
  } catch (e) {
    console.error(e);

    return { success: false, error: "CLIP_ERROR" } as const;
  }
};
