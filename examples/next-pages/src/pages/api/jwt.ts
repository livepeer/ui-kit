import { signAccessJwt } from "@livepeer/react/crypto";
import type { NextApiRequest, NextApiResponse } from "next";

export type CreateSignedPlaybackBody = {
  playbackId: string;
};

export type CreateSignedPlaybackResponse = {
  success: true;
  token: string;
};

export type ApiError = {
  success: false;
  message: string;
};

const livepeerPrivateKey = process.env.LIVEPEER_JWT_PRIVATE_KEY ?? "";
const livepeerPublicKey = process.env.LIVEPEER_JWT_PUBLIC_KEY ?? "";

if (process.env.VERCEL_ENV && (!livepeerPrivateKey || !livepeerPublicKey)) {
  throw new Error("No private/public key configured.");
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse<CreateSignedPlaybackResponse | ApiError>,
) => {
  try {
    const method = req.method;

    if (method === "POST") {
      const { playbackId }: CreateSignedPlaybackBody = req.body;

      if (!playbackId) {
        return res
          .status(400)
          .json({ success: false, message: "Missing data in body." });
      }

      // do some auth check before issuing this JWT (e.g. checkUserHasAccess(playbackId, userId))

      // we sign the JWT and return it to the user
      const token = await signAccessJwt({
        privateKey: livepeerPrivateKey,
        publicKey: livepeerPublicKey,
        issuer: "https://docs.livepeer.org",
        // playback ID to include in the JWT
        playbackId,
        // expire the JWT in 20 seconds
        expiration: 20,
        // custom metadata to include
        custom: {
          userId: "user-id",
        },
      });

      return res.status(200).json({ success: true, token });
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: (err as Error)?.message ?? "Error" });
  }
};
