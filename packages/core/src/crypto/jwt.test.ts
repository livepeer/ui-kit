// use jose to test
import { importSPKI, jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import { b64UrlDecode } from "../utils/string";
import { signAccessJwt } from "./jwt";

const commonOptions = {
  privateKey:
    "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JR0hBZ0VBTUJNR0J5cUdTTTQ5QWdFR0NDcUdTTTQ5QXdFSEJHMHdhd0lCQVFRZzlkeWpDWVI4RWl0UzBqUUoKQkNxbUJqMXdxVFhWeVZ6L3NCQmQ3WkxVcUIyaFJBTkNBQVRKQVpKVjN3Z3F5RkMwNk1qajNIc1NVbks0Z0RyZQpFMjFNNU8xWFRjNFM0dHdJbkwxV29zRi9JLzAzblhQQU5lVEV3dmk0dWpnL0FHNzg5VEk2UFJPMAotLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tCg==",
  publicKey:
    "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFeVFHU1ZkOElLc2hRdE9qSTQ5eDdFbEp5dUlBNgozaE50VE9UdFYwM09FdUxjQ0p5OVZxTEJmeVA5TjUxendEWGt4TUw0dUxvNFB3QnUvUFV5T2owVHRBPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==",
  issuer: "https://docs.livepeer.org",
} as const;

const verifyJwt = async (jws: string) => {
  const publicKey = await importSPKI(
    b64UrlDecode(commonOptions.publicKey) ?? "",
    "ES256",
  );

  // override the currentDate for verification
  return jwtVerify(jws, publicKey, { currentDate: new Date(Date.now()) });
};

describe("signAccessJwt", () => {
  it("signs with playbackId", async () => {
    const token = await signAccessJwt({
      ...commonOptions,
      playbackId: "abcd1234",
    });

    const decoded = await verifyJwt(token);

    expect(decoded.protectedHeader).toMatchInlineSnapshot(`
      {
        "alg": "ES256",
        "typ": "JWT",
      }
    `);
    expect(decoded.payload.action).toEqual("pull");
    expect(decoded.payload.pub).toEqual(commonOptions.publicKey);
    expect(decoded.payload.iss).toEqual("https://docs.livepeer.org");
    expect(decoded.payload.sub).toEqual("abcd1234");
    expect(decoded.payload.video).toEqual("none");
  });

  it("signs with a default duration", async () => {
    const token = await signAccessJwt({
      ...commonOptions,
      playbackId: "abcd1234",
    });

    const decoded = await verifyJwt(token);

    expect(decoded.protectedHeader).toMatchInlineSnapshot(`
      {
        "alg": "ES256",
        "typ": "JWT",
      }
    `);

    expect(
      (decoded.payload.exp ?? 0) - (decoded.payload.iat ?? 0),
    ).toMatchInlineSnapshot("86400");
  });

  it("signs with a custom duration", async () => {
    const token = await signAccessJwt({
      ...commonOptions,
      playbackId: "abcd1234",
      expiration: 300,
    });

    const decoded = await verifyJwt(token);

    expect(decoded.protectedHeader).toMatchInlineSnapshot(`
      {
        "alg": "ES256",
        "typ": "JWT",
      }
    `);

    expect(
      (decoded.payload.exp ?? 0) - (decoded.payload.iat ?? 0),
    ).toMatchInlineSnapshot("300");
  });
});
