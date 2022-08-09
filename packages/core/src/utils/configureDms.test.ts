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

import { dms } from '../constants';
import { studioProvider } from '../providers/studio';
import { Dms } from '../types';
import { configureDms } from './configureDms';

const defaultStudioApiKey = 'default-api-key';

const defaultDms = [dms.studio];

function getHandlers({
  dms,
  listener,
  url,
}: {
  dms: Dms[];
  listener: Mock;
  url: (dms: Dms) => string;
}) {
  const handlers = dms.map((chain) => {
    const urlEndpoint = url(chain);
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
  dms: defaultDms,
  listener: studioListener,
  url: (dms) => `${dms.url}`,
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
        const { providers } = configureDms([
          studioProvider({ apiKey: defaultStudioApiKey }),
        ]);

        expect(providers.map((p) => p?.getDms())).toMatchInlineSnapshot(`
          {
            name: 'Livepeer Studio',
            url: 'https://livepeer.studio',
          }
        `);
      });

      it('returns null if an API key is not provided', async () => {
        const { providers } = configureDms([
          studioProvider({ apiKey: defaultStudioApiKey }),
        ]);

        expect(providers[0]).toBe(null);
      });
    });
  });
});
