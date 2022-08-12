import { describe, expect, it } from 'vitest';

// import { setupClient } from '../../../test';
import { GetLPMSProviderResult } from './getLPMSProvider';
import { watchLPMSProvider } from './watchLPMSProvider';

describe('watchLPMSProvider', () => {
  it('callback receives data', async () => {
    // const client = setupClient();

    const providers: GetLPMSProviderResult[] = [];
    const unwatch = watchLPMSProvider((provider) => providers.push(provider));

    // await connect({ connector: client.connectors[0]! });
    // await disconnect();
    // await connect({ connector: client.connectors[0]! });
    unwatch();

    expect(providers).toMatchInlineSnapshot(`
      [
        "<Provider />"
      ]
    `);
  });
});
