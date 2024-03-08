import { signAccessJwt } from "@livepeer/react/crypto";
import { Livepeer } from "livepeer";
import type { ClipPayload } from "livepeer/dist/models/components";

import { unstable_cache } from "next/cache";
import { cache } from "react";

const livepeer = new Livepeer({
  apiKey: process.env.STUDIO_API_KEY ?? "",
  serverURL: process.env.STUDIO_BASE_URL,
});

const livepeerPrivateKey = process.env.LIVEPEER_JWT_PRIVATE_KEY ?? "";
const livepeerPublicKey = process.env.LIVEPEER_JWT_PUBLIC_KEY ?? "";

if (process.env.VERCEL_ENV && (!livepeerPrivateKey || !livepeerPublicKey)) {
  throw new Error("No private/public key configured.");
}

const getPlaybackInfoUncached = cache(async (playbackId: string) => {
  try {
    const playbackInfo = await livepeer.playback.get(playbackId);

    if (!playbackInfo.playbackInfo) {
      console.error("Error fetching playback info", playbackInfo);

      return null;
    }

    return playbackInfo.playbackInfo;
  } catch (e) {
    console.error(e);
    return null;
  }
});

export const getPlaybackInfo = unstable_cache(
  async (playbackId: string) => getPlaybackInfoUncached(playbackId),
  ["get-playback-info"],
  {
    revalidate: 120,
  },
);

const getPlaybackJWTUncached = cache(
  async (playbackId: string, userId: string) => {
    try {
      // add a more complex check here for actual permissions for the user ID
      if (userId !== "example-value") {
        return null;
      }

      const token = await signAccessJwt({
        privateKey: livepeerPrivateKey,
        publicKey: livepeerPublicKey,
        issuer: "https://docs.livepeer.org",
        // playback ID to include in the JWT
        playbackId,
        // expire the JWT in 1 hour
        expiration: 3600,
        // custom metadata to include
        custom: {
          userId,
        },
      });

      return token;
    } catch (e) {
      console.error(e);
      return null;
    }
  },
);

export const getPlaybackJWT = unstable_cache(
  async (playbackId: string, userId: string) =>
    getPlaybackJWTUncached(playbackId, userId),
  ["get-playback-jwt"],
  {
    revalidate: 120,
  },
);

export const createStreamClip = async (opts: ClipPayload) => {
  const result = await livepeer.stream.createClip(opts);

  return result;
};
