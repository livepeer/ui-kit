import { ClientConfig, createClient } from '../src';

type Config = Partial<ClientConfig>;

export function setupClient(config: Config = {}) {
  return createClient({
    ...config,
  });
}

export { getSigners } from './utils';
