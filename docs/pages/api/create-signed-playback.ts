import { signAccessJwt } from 'livepeer/crypto';
import { NextApiRequest, NextApiResponse } from 'next';

import { ApiError } from '../../lib/error';
import { provider } from '../../lib/provider';

export type CreateSignedPlaybackBody = {
  playbackId: string;
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

      const { playbackId }: CreateSignedPlaybackBody = req.body;

      if (!playbackId) {
        return res.status(400).json({ message: 'Missing data in body.' });
      }

      const token = await signAccessJwt(
        {
          privateKey: accessControlPrivateKey,
          publicKey: accessControlPublicKey,
          issuer: 'https://livepeerjs.org',
          playbackId,
        },
        {
          provider,
        },
      );

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
