import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { livepeer } from "@/lib/livepeer";

type ResponseData =
  | {
      success: true;
      playbackId: string;
    }
  | {
      success: false;
      error: string;
    };

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    const clipPayloadParsed = await clipPayloadSchema.safeParseAsync(req.body);

    if (!clipPayloadParsed.success) {
      console.error(clipPayloadParsed.error);

      return res
        .status(400)
        .json({ success: false, error: "PARAMS_ERROR" } as const);
    }

    const result = await livepeer.stream.createClip(clipPayloadParsed.data);

    if (!result.data?.asset?.playbackId) {
      return res
        .status(400)
        .json({ success: false, error: "PLAYBACK_ID_MISSING" } as const);
    }

    return res.status(200).json({
      success: true,
      playbackId: result.data?.asset?.playbackId,
    });
  } catch (e) {
    console.error(e);

    return res
      .status(500)
      .json({ success: false, error: "CLIP_ERROR" } as const);
  }
}
