import type { PlaybackAccessControlRequest } from '@livepeer/react';
import type { NextApiRequest, NextApiResponse } from 'next';

export type WebhookContext = {
  userId: string;
};

export type WebhookResponse = {
  error?: string | null;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<WebhookResponse>,
) {
  const body: PlaybackAccessControlRequest<WebhookContext> = req.body;

  if (body.accessKey === 'verysecret22') {
    return res.status(200).json({});
  }

  return res.status(401).json({ error: 'Not allowed' });
}
