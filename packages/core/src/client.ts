import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Mutate, StoreApi, default as create } from 'zustand/vanilla';

import { ClientStorage, createStorage, noopStorage } from './storage';
import { DmsProvider } from './types';

export type ClientConfig<TDmsProvider extends DmsProvider = DmsProvider> = {
  /** Enables reconnecting to last used provider on init */
  autoConnect?: boolean;
  /** Interface for connecting to provider */
  provider: (() => TDmsProvider) | TDmsProvider;
  /**
   * Custom storage for data persistence
   * @default window.localStorage
   */
  storage?: ClientStorage;
};

export type State<TDmsProvider extends DmsProvider = DmsProvider> = {
  error?: Error;
  provider: TDmsProvider;
};

const storeKey = 'livepeer-store';

export class Client<TDmsProvider extends DmsProvider = DmsProvider> {
  config: Partial<ClientConfig<TDmsProvider>>;
  storage: ClientStorage;
  store: Mutate<
    StoreApi<State<TDmsProvider>>,
    [
      ['zustand/subscribeWithSelector', never],
      ['zustand/persist', Partial<State<TDmsProvider>>],
    ]
  >;

  constructor({
    provider,
    storage = createStorage({
      storage:
        typeof window !== 'undefined' ? window.localStorage : noopStorage,
    }),
  }: ClientConfig<TDmsProvider>) {
    // Create store
    this.store = create(
      subscribeWithSelector(
        persist<
          State<TDmsProvider>,
          [['zustand/subscribeWithSelector', never]]
        >(
          () => ({
            provider: typeof provider === 'function' ? provider() : provider,
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
      | State<TDmsProvider>
      | ((state: State<TDmsProvider>) => State<TDmsProvider>),
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

export let client: Client<DmsProvider>;

export function createClient<TDmsProvider extends DmsProvider = DmsProvider>(
  config: ClientConfig<TDmsProvider>,
) {
  const client_ = new Client<TDmsProvider>(config);
  client = client_ as unknown as Client<DmsProvider>;
  return client_;
}

export function getClient<TDmsProvider extends DmsProvider = DmsProvider>() {
  if (!client) {
    throw new Error('No livepeer client found.');
  }
  return client as unknown as Client<TDmsProvider>;
}
