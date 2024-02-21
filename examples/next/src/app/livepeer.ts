import { signAccessJwt } from "@livepeer/react/crypto";
import { Livepeer } from "livepeer";

import { unstable_cache } from "next/cache";
import { cache } from "react";

const livepeer = new Livepeer({
  apiKey: process.env.STUDIO_API_KEY ?? "",
});

const livepeerPrivateKey = process.env.LIVEPEER_JWT_PRIVATE_KEY;
const livepeerPublicKey = process.env.LIVEPEER_JWT_PUBLIC_KEY;

if (!livepeerPrivateKey || !livepeerPublicKey) {
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

const getPlaybackJWTUncached = cache(async (playbackId: string) => {
  try {
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
        userId: "user-id-1",
      },
    });

    return token;
  } catch (e) {
    console.error(e);
    return null;
  }
});

export const getPlaybackJWT = unstable_cache(
  async (playbackId: string) => getPlaybackJWTUncached(playbackId),
  ["get-playback-jwt"],
  {
    revalidate: 120,
  },
);
