"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const createLivestream = async () => {
  try {
    // const newStream = await createStream({
    //   name: "PubNub <> Livepeer Stream",
    // });

    // if (!newStream?.classes?.[0].streamKey) {
    //   return {
    //     success: false,
    //     error: "No stream key created.",
    //   } as const;
    // }

    cookies().set("stream-key", "26d5-g6vc-dnmq-umz6");
    cookies().set("playback-id", "26d5m3zw80ejzby6");

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
