import ms, { StringValue } from 'ms';

import { getStream } from '../actions';
import { ClientConfig, createClient } from '../client';
import { LivepeerProvider } from '../types';
import { b64Decode, b64UrlEncode } from '../utils';
import { signEcdsaSha256 } from './ecdsa';
import { importPKCS8 } from './pkcs8';

export type JWTPayload = {
  /**
   * JWT Issuer
   *
   * @see [RFC7519#section-4.1.1](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.1)
   */
  iss?: string;

  /**
   * JWT Subject
   *
   * @see [RFC7519#section-4.1.2](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.2)
   */
  sub?: string;

  /** JWT Audience [RFC7519#section-4.1.3](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.3). */
  aud?: string | string[];

  /**
   * JWT ID
   *
   * @see [RFC7519#section-4.1.7](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.7)
   */
  jti?: string;

  /**
   * JWT Not Before
   *
   * @see [RFC7519#section-4.1.5](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.5)
   */
  nbf?: number;

  /**
   * JWT Expiration Time
   *
   * @see [RFC7519#section-4.1.4](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.4)
   */
  exp?: number;

  /**
   * JWT Issued At
   *
   * @see [RFC7519#section-4.1.6](https://www.rfc-editor.org/rfc/rfc7519#section-4.1.6)
   */
  iat?: number;

  /**
   * Allowed action for this token. `pull` is allowing playback. Custom claim.
   */
  action: 'pull';

  /** Any other JWT Claim Set member. */
  [propName: string]: unknown;
};

export type JWTHeader = {
  /** JWE "alg" (Algorithm) Header Parameter. */
  alg: 'ES256';

  /** "typ" (Type) Header Parameter. */
  typ: 'JWT';
};

export type SignAccessJwtOptions = {
  /**
   * The private key used to sign the token. **This comes base64-encoded from the livepeer provider
   * - this should be kept as base64.**
   *
   * This can also be a CryptoKey if the key has already been imported on the client.
   */
  privateKey: CryptoKey | string;

  /**
   * The public key corresponding to the public key. **This comes
   * base64-encoded from the livepeer provider - this should be kept as base64.**
   */
  publicKey: string;

  /**
   * The playback ID which you would like to restrict access to (required if `streamId`
   * is not provided).
   */
  playbackId?: string;

  /**
   * The stream ID which you would like to restrict access to (required if `playbackId`
   * is not provided).
   */
  streamId?: string;

  /**
   * The issuer of the token. Usually a string or URL identifying your app.
   */
  issuer: string;

  /**
   * The expiration of the token in unix timestamp. If a string is passed, it must be a duration like `1d`
   * and will be added to the current timestamp. If a number is passed, this will be used as the expiration.
   * Defaults to `1d`.
   */
  expiration?: StringValue;

  /**
   * Custom properties added to the token. These can be used across your app to hold token state (user ID, etc).
   */
  custom?: {
    [key: string]: unknown;
  };
} & (
  | {
      streamId: string;
    }
  | {
      playbackId: string;
    }
);

/**
 * Signs a JSON Web Token which can be used to view access-restricted media. If you have not instantiated a client yet,
 * will throw a "No livepeer client found." error if no `config` is passed.
 *
 * Throws if there is an error fetching a stream by ID.
 */
export const signAccessJwt = async <
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(
  options: SignAccessJwtOptions,
  config?: ClientConfig<TLivepeerProvider>,
): Promise<string> => {
  // assume strings passed are PEM-encoded PKCS8 (or base64 encoded)
  // try to coerce the input from base64, or use as-is
  const privateKey =
    typeof options.privateKey === 'string'
      ? await importPKCS8(b64Decode(options.privateKey) ?? options.privateKey)
      : options.privateKey;

  if (!privateKey) {
    throw new Error('Error importing private key.');
  }

  let playbackId = options?.playbackId;

  if (options?.streamId) {
    if (config) {
      createClient(config);
    }

    const stream = await getStream({ streamId: options.streamId });

    playbackId = stream.playbackId;
  }

  if (!playbackId) {
    throw new Error(
      'Playback ID was not provided and stream playback ID could not be fetched.',
    );
  }

  const issuedAtSec = Date.now() / 1000;
  const expirationSec = issuedAtSec + ms(options.expiration ?? '1d') / 1000;

  const payload: JWTPayload = {
    action: 'pull',
    iss: options.issuer,
    pub: options.publicKey,
    sub: playbackId,
    video: 'none',
    exp: Number(expirationSec.toFixed(0)),
    iat: Number(issuedAtSec.toFixed(0)),

    ...(options.custom
      ? {
          custom: {
            ...options.custom,
          },
        }
      : {}),
  };

  const header: JWTHeader = {
    alg: 'ES256',
    typ: 'JWT',
  };

  const base64Header = b64UrlEncode(JSON.stringify(header));
  const base64Payload = b64UrlEncode(JSON.stringify(payload));

  const body = `${base64Header}.${base64Payload}`;

  const signatureBuffer = await signEcdsaSha256(privateKey, Buffer.from(body));

  const signature = b64UrlEncode(
    String.fromCharCode(...new Uint8Array(signatureBuffer)),
  );

  return `${base64Header}.${base64Payload}.${signature}`;
};
