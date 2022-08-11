import { persist, subscribeWithSelector } from 'zustand/middleware';
import { Mutate, StoreApi, default as create } from 'zustand/vanilla';

import { ClientStorage, createStorage, noopStorage } from './storage';
import { LPMSProvider } from './types';

export type ClientConfig<TLPMSProvider extends LPMSProvider = LPMSProvider> = {
  /** Enables reconnecting to last used provider on init */
  autoConnect?: boolean;
  /** Interface for connecting to provider */
  provider: (() => TLPMSProvider) | TLPMSProvider;
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
    this.store = create(
      subscribeWithSelector(
        persist<
          State<TLPMSProvider>,
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

export let livepeerClient: Client<LPMSProvider>;

export function createLivepeerClient<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>(config: ClientConfig<TLPMSProvider>) {
  const client_ = new Client<TLPMSProvider>(config);
  livepeerClient = client_ as unknown as Client<LPMSProvider>;
  return client_;
}

export function getLivepeerClient<
  TLPMSProvider extends LPMSProvider = LPMSProvider,
>() {
  if (!livepeerClient) {
    throw new Error('No livepeer client found.');
  }
  return livepeerClient as unknown as Client<TLPMSProvider>;
}
