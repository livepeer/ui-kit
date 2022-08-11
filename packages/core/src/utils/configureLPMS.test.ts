import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  Mock,
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { defaultLPMS } from '../constants';
import { studioProvider } from '../providers/studio';
import { LPMediaServer } from '../types';

import { configureLPMS } from './configureLPMS';

const defaultStudioApiKey = 'default-api-key';

function getHandlers({
  lpms,
  listener,
  baseUrl,
}: {
  lpms: LPMediaServer[];
  listener: Mock;
  baseUrl: (LPMS: LPMediaServer) => string;
}) {
  const handlers = lpms.map((lpms) => {
    const urlEndpoint = baseUrl(lpms);
    return rest.post(urlEndpoint, (_req, res, ctx) => {
      listener();
      return res(
        ctx.status(200),
        ctx.json({ jsonrpc: '2.0', id: 42, result: '0xe0e7b1' }),
      );
    });
  });
  return handlers;
}

const studioListener = vi.fn();
const studioHandlers = getHandlers({
  lpms: defaultLPMS.map((l) => l),
  listener: studioListener,
  baseUrl: (LPMS) => `${LPMS.baseUrl}`,
});

const server = setupServer(...studioHandlers);

describe('configureChains', () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
    studioListener.mockClear();
  });

  afterAll(() => {
    server.close();
  });

  describe('single provider', () => {
    describe('studio', () => {
      it('populates the provider correctly if an API key is provided', async () => {
        const { providers } = configureLPMS([
          studioProvider({ apiKey: defaultStudioApiKey }),
        ]);

        expect(providers.map((p) => p?.getLPMediaServer()))
          .toMatchInlineSnapshot(`
          {
            name: 'Livepeer Studio',
            url: 'https://livepeer.studio',
          }
        `);
      });

      it('returns null if an API key is not provided', async () => {
        const { providers } = configureLPMS([
          studioProvider({ apiKey: defaultStudioApiKey }),
        ]);

        expect(providers[0]).toBe(null);
      });
    });
  });
});
