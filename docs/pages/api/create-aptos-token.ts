import { AptosAccount, AptosClient, HexString, TokenClient } from 'aptos';

const NODE_URL = 'https://fullnode.devnet.aptoslabs.com';

import { NextApiRequest, NextApiResponse } from 'next';

import { ApiError } from '../../lib/error';

export type CreateAptosTokenBody = {
  receiver: string;
  metadataUri: string;
};

export type CreateAptosTokenResponse = {
  creator: string;
  collectionName: string;
  tokenName: string;
  tokenPropertyVersion: number;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CreateAptosTokenResponse | ApiError>,
) => {
  try {
    const method = req.method;

    if (method === 'POST') {
      const { receiver, metadataUri }: CreateAptosTokenBody = req.body;

      if (!receiver || !metadataUri) {
        return res.status(400).json({ message: 'Missing data in body.' });
      }

      const client = new AptosClient(NODE_URL);
      const tokenClient = new TokenClient(client);

      if (!process.env.APTOS_PRIVATE_KEY) {
        return res.status(500).json({ message: 'Aptos config missing.' });
      }

      const issuer = new AptosAccount(
        new HexString(process.env.APTOS_PRIVATE_KEY).toUint8Array(),
      );

      const collectionName = 'Livepeer';
      const tokenPropertyVersion = 0;

      const collectionData = await tokenClient.getCollectionData(
        issuer.address(),
        collectionName,
      );

      const tokenName = `Video NFT ${Number(collectionData?.supply ?? 0) + 1}`;

      const txnHash2 = await tokenClient.createToken(
        issuer,
        collectionName,
        tokenName,
        tokenName,
        1,
        metadataUri,
      );
      await client.waitForTransaction(txnHash2, { checkSuccess: true });

      const txnHash5 = await tokenClient.offerToken(
        issuer,
        receiver,
        issuer.address(),
        collectionName,
        tokenName,
        1,
        tokenPropertyVersion,
      );
      await client.waitForTransaction(txnHash5, { checkSuccess: true });

      return res.status(200).json({
        creator: issuer.address().hex(),
        collectionName,
        tokenName,

        tokenPropertyVersion,
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
