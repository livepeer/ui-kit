import { decodeJwt } from 'jose';
import { describe, expect, it } from 'vitest';

import { setupClient } from '../../test';
import { studioProvider } from '../providers/studio';

import { signAccessJwt } from './jwt';

// stream ID which was generated previously for tests
const streamId = 'd7ae985a-7a27-4c18-a00c-22a5b5ea7e10';

const commonOptions = {
  privateKey:
    '-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgIiR3kYwhLTMY7Jfe\nZZ20lK5WF8QcUhiBfr/VXukkijGhRANCAASijOcHY3nUo9ZiA1Z9JK+UMKAtHM+3\nvD987L87T7E59y49z+7D6nruo9TAm+vhr7AuCBy8OoalKKoiKcChO0Y4\n-----END PRIVATE KEY-----\n',
  publicKey:
    'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFb296bkIyTjUxS1BXWWdOV2ZTU3ZsRENnTFJ6UAp0N3cvZk95L08wK3hPZmN1UGMvdXcrcDY3cVBVd0p2cjRhK3dMZ2djdkRxR3BTaXFJaW5Bb1R0R09BPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==',
  issuer: 'https://livepeerjs.org',
} as const;

describe('signAccessJwt', () => {
  it('signs with playbackId', async () => {
    const token = await signAccessJwt({
      ...commonOptions,
      playbackId: 'abcd1234',
    });

    const decoded = decodeJwt(token);

    expect(decoded.action).toEqual('pull');
    expect(decoded.pub).toEqual(
      'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFb296bkIyTjUxS1BXWWdOV2ZTU3ZsRENnTFJ6UAp0N3cvZk95L08wK3hPZmN1UGMvdXcrcDY3cVBVd0p2cjRhK3dMZ2djdkRxR3BTaXFJaW5Bb1R0R09BPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==',
    );
    expect(decoded.iss).toEqual('https://livepeerjs.org');
    expect(decoded.sub).toEqual('abcd1234');
    expect(decoded.video).toEqual('none');
  });

  it('fails to signs with streamId and no client', async () => {
    await expect(
      signAccessJwt({
        ...commonOptions,
        streamId,
      }),
    ).rejects.toMatchInlineSnapshot('[Error: No livepeer client found.]');
  });

  it('signs with streamId', async () => {
    const token = await signAccessJwt(
      {
        ...commonOptions,
        streamId,
      },
      {
        provider: studioProvider({
          apiKey: process.env.STUDIO_API_KEY,
        }),
      },
    );

    const decoded = decodeJwt(token);

    expect(decoded.action).toEqual('pull');
    expect(decoded.pub).toEqual(
      'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFb296bkIyTjUxS1BXWWdOV2ZTU3ZsRENnTFJ6UAp0N3cvZk95L08wK3hPZmN1UGMvdXcrcDY3cVBVd0p2cjRhK3dMZ2djdkRxR3BTaXFJaW5Bb1R0R09BPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==',
    );
    expect(decoded.iss).toEqual('https://livepeerjs.org');
    expect(decoded.sub).toEqual('d7aer9qx8act4lfd');
    expect(decoded.video).toEqual('none');
  });

  it('signs with streamId and a global client', async () => {
    setupClient();

    const token = await signAccessJwt({
      ...commonOptions,
      streamId,
    });

    const decoded = decodeJwt(token);

    expect(decoded.action).toEqual('pull');
    expect(decoded.pub).toEqual(
      'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFb296bkIyTjUxS1BXWWdOV2ZTU3ZsRENnTFJ6UAp0N3cvZk95L08wK3hPZmN1UGMvdXcrcDY3cVBVd0p2cjRhK3dMZ2djdkRxR3BTaXFJaW5Bb1R0R09BPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==',
    );
    expect(decoded.iss).toEqual('https://livepeerjs.org');
    expect(decoded.sub).toEqual('d7aer9qx8act4lfd');
    expect(decoded.video).toEqual('none');
  });

  it('signs with a default duration', async () => {
    setupClient();

    const token = await signAccessJwt({
      ...commonOptions,
      streamId,
    });

    const decoded = decodeJwt(token);

    expect((decoded.exp ?? 0) - (decoded.iat ?? 0)).toMatchInlineSnapshot(
      '86400',
    );
  });

  it('signs with a custom duration', async () => {
    setupClient();

    const token = await signAccessJwt({
      ...commonOptions,
      streamId,
      expiration: '300s',
    });

    const decoded = decodeJwt(token);

    expect((decoded.exp ?? 0) - (decoded.iat ?? 0)).toMatchInlineSnapshot(
      '300',
    );
  });
});
