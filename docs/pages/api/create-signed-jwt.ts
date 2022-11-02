import { b64UrlDecode } from 'livepeer';
import { signAccessJwt } from 'livepeer/crypto';
import { NextApiRequest, NextApiResponse } from 'next';

import { ApiError } from '../../lib/error';

export type CreateSignedPlaybackBody = {
  playbackId: string;
  secret: string;
};

export type CreateSignedPlaybackResponse = {
  token: string;
};

const accessControlPrivateKey = process.env.ACCESS_CONTROL_PRIVATE_KEY;
const accessControlPublicKey =
  process.env.NEXT_PUBLIC_ACCESS_CONTROL_PUBLIC_KEY;

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateSignedPlaybackResponse | ApiError>,
) => {
  try {
    const method = req.method;

    if (method === 'POST') {
      if (!accessControlPrivateKey || !accessControlPublicKey) {
        return res
          .status(500)
          .json({ message: 'No private/public key configured.' });
      }

      const { playbackId, secret }: CreateSignedPlaybackBody = req.body;

      if (!playbackId || !secret) {
        return res.status(400).json({ message: 'Missing data in body.' });
      }

      if (secret !== 'supersecretkey') {
        return res.status(401).json({ message: 'Incorrect secret.' });
      }

      const token = await signAccessJwt({
        privateKey: b64UrlDecode(accessControlPrivateKey) ?? '',
        publicKey: accessControlPublicKey,
        issuer: 'https://livepeerjs.org',
        playbackId,
      });

      return res.status(200).json({
        token,
      });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: (err as Error)?.message ?? 'Error' });
  }
};

export default handler;
