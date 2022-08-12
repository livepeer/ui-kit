import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Mutate, StoreApi, default as create } from 'zustand/vanilla';

import { LPMSProviderFn } from './providers/base';

import { ClientStorage, createStorage, noopStorage } from './storage';
import { LPMSProvider } from './types';

export type ClientConfig<TLPMSProvider extends LPMSProvider = LPMSProvider> = {
  /** Enables reconnecting to last used provider on init */
  autoConnect?: boolean;
  /** Interface(s) for connecting to provider(s) */
  providers: LPMSProviderFn<TLPMSProvider>[];
  /**
   * Custom storage for data persistence
   * @default window.localStorage
   */
  storage?: ClientStorage;
};

export type State<TLPMSProvider extends LPMSProvider = LPMSProvider> = {
  error?: Error;
  providers: TLPMSProvider[];
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
    providers,
    storage = createStorage({
      storage:
        typeof window !== 'undefined' ? window.localStorage : noopStorage,
    }),
  }: ClientConfig<TLPMSProvider>) {
    if (providers.length === 0) {
      throw new Error(`No providers in config`);
    }
    // Create store
    this.store = create(
      subscribeWithSelector(
        persist<
          State<TLPMSProvider>,
          [['zustand/subscribeWithSelector', never]]
        >(
          () => ({
            providers: providers.map((provider) => provider.provider),
          }),
          {
            name: storeKey,
            getStorage: () => storage,
            version: 1,
          },
        ),
      ),
    );

    this.config = {
      providers,
      storage,
    };
    this.storage = storage;
  }

  get error() {
    return this.store.getState().error;
  }
  get provider() {
    return this.store.getState().providers[0];
  }
  get providers() {
    return this.store.getState().providers;
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
