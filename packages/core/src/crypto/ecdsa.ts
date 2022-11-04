import { getSubtleCrypto } from './getSubtleCrypto';

export const signEcdsaSha256 = async (
  privateKey: CryptoKey,
  data: BufferSource,
) => {
  const subtleCrypto = await getSubtleCrypto();

  return subtleCrypto.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' },
    },
    privateKey,
    data,
  );
};
