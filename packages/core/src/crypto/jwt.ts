import { JWTPayload, KeyLike, SignJWT, importPKCS8 } from 'jose';

import { getStream } from '../actions';
import { ClientConfig, createClient } from '../client';
import { LivepeerProvider } from '../types';

const ACCESS_KEY_ALGORITHM = 'ES256';

type Duration =
  | 'seconds'
  | 'secs'
  | 's'
  | 'minutes'
  | 'mins'
  | 'm'
  | 'hours'
  | 'hrs'
  | 'h'
  | 'days'
  | 'd'
  | 'weeks'
  | 'w'
  | 'years'
  | 'yrs'
  | 'y';
type TokenDuration = `${string}${Duration}`;

export type SignAccessJwtOptions = {
  /**
   * The private key used to sign the token.
   */
  privateKey: KeyLike | Uint8Array | string;
  /**
   * The public key corresponding to the public key. **This comes
   * base64-encoded from the provider - this should be provided as-is.**
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
  expiration?: TokenDuration | number;
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
  // we assume strings passed are PEM-encoded PKCS8
  const privateKey =
    typeof options.privateKey === 'string'
      ? await importPKCS8(options.privateKey, ACCESS_KEY_ALGORITHM)
      : options.privateKey;

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

  const payload: JWTPayload = {
    action: 'pull', // Allowed action for this token. `pull` is allowing playback
    ...(options.custom
      ? {
          custom: {
            ...options.custom,
          },
        }
      : {}),
    iss: options.issuer,
    pub: options.publicKey,
    sub: playbackId,
    video: 'none',
  };

  return new SignJWT(payload)
    .setProtectedHeader({ alg: ACCESS_KEY_ALGORITHM, typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(options.expiration ?? '1d')
    .sign(privateKey);
};
