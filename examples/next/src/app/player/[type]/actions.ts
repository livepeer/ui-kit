"use server";

import { createStreamClip } from "@/app/livepeer";
import type { ClipPayload } from "livepeer/models/components";
import z from "zod";

const isValidUnixTimestamp = (timestamp: number) => {
  const now = Date.now();
  const oneHourAgo = now - 1 * 60 * 60 * 1000;
  return timestamp >= oneHourAgo && timestamp <= now;
};

const clipPayloadSchema = z
  .object({
    playbackId: z.string(),
    startTime: z.number().refine(isValidUnixTimestamp, {
      message:
        "Start time must be a valid Unix timestamp in milliseconds and within the past hour.",
    }),
    endTime: z.number().refine(isValidUnixTimestamp, {
      message:
        "End time must be a valid Unix timestamp in milliseconds and within the past hour.",
    }),
  })
  .refine(
    (data) => {
      return (
        data.endTime > data.startTime && data.endTime <= data.startTime + 60000
      );
    },
    {
      message: "Clip cannot be longer than 60 seconds.",
    },
  );

export const createClip = async (opts: ClipPayload) => {
  try {
    const clipPayloadParsed = await clipPayloadSchema.safeParseAsync(opts);

    if (!clipPayloadParsed.success) {
      console.error(clipPayloadParsed.error);

      return { success: false, error: "PARAMS_ERROR" } as const;
    }

    const result = await createStreamClip(opts);

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
