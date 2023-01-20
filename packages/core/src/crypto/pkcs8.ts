import { getSubtleCrypto } from './getSubtleCrypto';
import { b64UrlDecode } from '../utils';

export const importPKCS8 = async (pkcs8: string): Promise<CryptoKey> => {
  if (
    typeof pkcs8 !== 'string' ||
    pkcs8.indexOf('-----BEGIN PRIVATE KEY-----') !== 0
  ) {
    throw new TypeError('"pkcs8" must be PKCS8 formatted string');
  }

  const privateKeyContents = b64UrlDecode(
    pkcs8.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ''),
  );

  if (!privateKeyContents) {
    throw new TypeError('Could not base64 decode private key contents.');
  }

  const subtleCrypto = await getSubtleCrypto();

  return subtleCrypto.importKey(
    'pkcs8',
    new Uint8Array(privateKeyContents?.split('').map((c) => c.charCodeAt(0))),
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign'],
  );
};
