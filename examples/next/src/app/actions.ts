"use server";

import { ClipPayload } from "livepeer/dist/models/components";
import { livepeer } from "./livepeer";

export const createClip = async (opts: ClipPayload) => {
  const result = await livepeer.stream.createClip({
    ...opts,
  });

  // ... do something with the clip!
  console.log(result);
};
