import type { NextApiRequest, NextApiResponse } from 'next';

export type SecretRequest = {
  userId: string;
};

export type SecretResponse = {
  secret?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SecretResponse>,
) {
  const body: SecretRequest = req.body;

  if (
    body.userId ===
    'this is a demo user id which is passed along to the backend'
  ) {
    return res.status(200).json({ secret: 'verysecret22' });
  }

  return res.status(401).json({});
}
