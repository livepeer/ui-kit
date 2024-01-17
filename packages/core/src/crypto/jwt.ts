import { b64Decode, b64UrlEncode } from "../utils";
import { signEcdsaSha256 } from "./ecdsa";
import { importPKCS8 } from "./pkcs8";

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
  action: "pull";

  /** Any other JWT Claim Set member. */
  [propName: string]: unknown;
};

export type JWTHeader = {
  /** JWE "alg" (Algorithm) Header Parameter. */
  alg: "ES256";

  /** "typ" (Type) Header Parameter. */
  typ: "JWT";
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
   * The playback ID which you would like to restrict access to (required).
   */
  playbackId: string;

  /**
   * The issuer of the token. Usually a string or URL identifying your app.
   */
  issuer: string;

  /**
   * The expiration of the token in seconds. Defaults to `86400` or one day in seconds.
   */
  expiration?: number;

  /**
   * Custom properties added to the token. These can be used across your app to hold token state (user ID, etc).
   */
  custom?: {
    [key: string]: unknown;
  };
};
/**
 * Signs a JSON Web Token which can be used to view access-restricted media. If you have not instantiated a client yet,
 * will throw a "No livepeer client found." error if no `config` is passed.
 *
 * Throws if there is an error fetching a stream by ID.
 */
export const signAccessJwt = async (
  options: SignAccessJwtOptions,
): Promise<string> => {
  // assume strings passed are PEM-encoded PKCS8 (or base64 encoded)
  // try to coerce the input from base64, or use as-is
  const privateKey =
    typeof options.privateKey === "string"
      ? await importPKCS8(b64Decode(options.privateKey) ?? options.privateKey)
      : options.privateKey;

  if (!privateKey) {
    throw new Error("Error importing private key.");
  }

  const issuedAtSec = Date.now() / 1000;
  const expirationSec = issuedAtSec + (options.expiration ?? 86400);

  const payload: JWTPayload = {
    action: "pull",
    iss: options.issuer,
    pub: options.publicKey,
    sub: options.playbackId,
    video: "none",
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
    alg: "ES256",
    typ: "JWT",
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
