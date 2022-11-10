import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Mutate, StoreApi, default as create } from 'zustand/vanilla';

import { ClientStorage, createStorage, noopStorage } from '../storage';
import { LivepeerProvider } from '../types';

export type ClientConfig<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = {
  /** Interface(s) for connecting to provider(s) */
  provider: () => TLivepeerProvider;
  /**
   * Custom storage for data persistence
   * @default window.localStorage
   */
  storage?: ClientStorage;
};

export type State<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> = {
  error?: Error;
  provider: TLivepeerProvider;
};

const storeKey = 'livepeer-store';

export class Client<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
> {
  config: Partial<ClientConfig<TLivepeerProvider>>;
  storage: ClientStorage;
  store: Mutate<
    StoreApi<State<TLivepeerProvider>>,
    [
      ['zustand/subscribeWithSelector', never],
      ['zustand/persist', Partial<State<TLivepeerProvider>>],
    ]
  >;

  constructor({
    provider,
    storage = createStorage({
      storage: noopStorage,
    }),
  }: ClientConfig<TLivepeerProvider>) {
    // Create store
    this.store = create<
      State<TLivepeerProvider>,
      [
        ['zustand/subscribeWithSelector', never],
        ['zustand/persist', Partial<State<TLivepeerProvider>>],
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
      | State<TLivepeerProvider>
      | ((state: State<TLivepeerProvider>) => State<TLivepeerProvider>),
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

export let client: Client<LivepeerProvider> | null = null;

export function createClient<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(config: ClientConfig<TLivepeerProvider>) {
  const client_ = new Client<TLivepeerProvider>(config);
  client = client_ as unknown as Client<LivepeerProvider>;
  return client_;
}

export function getClient<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>() {
  if (!client) {
    throw new Error('No livepeer client found.');
  }
  return client as unknown as Client<TLivepeerProvider>;
}

export function clearClient() {
  client = null;
}
