import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Mutate, StoreApi, default as create } from 'zustand/vanilla';

import { ClientStorage, createStorage, noopStorage } from './storage';
import { LPMSProvider } from './types';

export type ClientConfig<TLPMSProvider extends LPMSProvider = LPMSProvider> = {
  /** Interface(s) for connecting to provider(s) */
  provider: () => TLPMSProvider;
  /**
   * Custom storage for data persistence
   * @default window.localStorage
   */
  storage?: ClientStorage;
};

export type State<TLPMSProvider extends LPMSProvider = LPMSProvider> = {
  error?: Error;
  provider: TLPMSProvider;
};

const storeKey = 'livepeer-store';

export class Client<TLPMSProvider extends LPMSProvider = LPMSProvider> {
  config: Partial<ClientConfig<TLPMSProvider>>;
  storage: ClientStorage;
  store: Mutate<
    StoreApi<State<TLPMSProvider>>,
    [
      ['zustand/subscribeWithSelector', never],
      ['zustand/persist', Partial<State<TLPMSProvider>>],
    ]
  >;

  constructor({
    provider,
    storage = createStorage({
      storage:
        typeof window !== 'undefined' ? window.localStorage : noopStorage,
    }),
  }: ClientConfig<TLPMSProvider>) {
    // Create store
    this.store = create<
      State<TLPMSProvider>,
      [
        ['zustand/subscribeWithSelector', never],
        ['zustand/persist', Partial<State<TLPMSProvider>>],
      ]
    >(
      subscribeWithSelector(
        persist(
          () => ({
            provider: provider(),
          }),
          {
            name: storeKey,
            getStorage: () => storage,
            // for now, we don't store any state in local storage
            partialize: (_state) => ({}),
            version: 1,
          },
        ),
      ),
    );

    this.config = {
      provider,
      storage,
    };
    this.storage = storage;
  }

  get error() {
    return this.store.getState().error;
  }
  get provider() {
    return this.store.getState().provider;
  }
  get subscribe() {
    return this.store.subscribe;
  }

  setState(
    updater:
      | State<TLPMSProvider>
      | ((state: State<TLPMSProvider>) => State<TLPMSProvider>),
  ) {
    const newState =
      typeof updater === 'function' ? updater(this.store.getState()) : updater;
    this.store.setState(newState, true);
  }

  clearState() {
    this.setState((x) => ({
      ...x,
      data: undefined,
      error: undefined,
    }));
  }

  async destroy() {
    this.clearState();
    this.store.destroy();
  }
}

export let client: Client<LPMSProvider>;

export function createClient<TLPMSProvider extends LPMSProvider = LPMSProvider>(
  config: ClientConfig<TLPMSProvider>,
) {
  const client_ = new Client<TLPMSProvider>(config);
  client = client_ as unknown as Client<LPMSProvider>;
  return client_;
}

export function getClient<TLPMSProvider extends LPMSProvider = LPMSProvider>() {
  if (!client) {
    throw new Error('No livepeer client found.');
  }
  return client as unknown as Client<TLPMSProvider>;
}
