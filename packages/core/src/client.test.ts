import { describe, expect, it } from 'vitest';

import { Client, createClient, getClient } from './client';

import { studioProvider } from './providers/studio';

import { createStorage } from './storage';

const provider = studioProvider();

describe('createClient', () => {
  it('returns client', () => {
    const client = createClient({
      provider,
    });
    expect(client).toBeInstanceOf(Client);
  });

  describe('config', () => {
    describe('provider', () => {
      it('default', () => {
        const client = createClient({
          provider,
        });
        expect(client.provider).toBeDefined();
      });
    });

    describe('storage', () => {
      it('default', () => {
        const client = createClient({
          provider,
        });
        expect(client.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `);
      });

      it('custom', () => {
        const client = createClient({
          provider,
          storage: createStorage({
            storage: window.localStorage,
          }),
        });
        expect(client.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `);
      });
    });
  });
});

describe('getClient', () => {
  it('returns default client', () => {
    expect(getClient()).toBeDefined();
  });

  it('returns created client', () => {
    const client = createClient({
      provider,
    });
    expect(getClient()).toEqual(client);
  });
});
