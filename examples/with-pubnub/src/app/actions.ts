"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createLivestream = async () => {
  try {
    if (process.env.STREAM_KEY && process.env.PLAYBACK_ID) {
      cookies().set("stream-key", process.env.STREAM_KEY);
      cookies().set("playback-id", "26d5m3zw80ejzby6");
    } else {
      return {
        success: false,
        error: "No stream key created.",
      } as const;
    }

    revalidatePath("/");

    return {
      success: true,
    } as const;
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "Could not create livestream.",
    } as const;
  }
};
