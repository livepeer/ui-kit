import { ClientConfig, createClient } from '../src';
import { studioProvider } from '../src/providers/studio';

export function setupClient(config?: Partial<ClientConfig>) {
  return createClient({
    provider: studioProvider(),
    ...config,
  });
}

export { getSigners } from './utils';
