import { ClientConfig, createClient } from '../src';
import { studioProvider } from '../src/providers/studio';

export function setupClient(config?: Partial<ClientConfig>) {
  return createClient({
    provider: studioProvider({
      apiKey:
        process.env.STUDIO_API_KEY ?? 'a2f68bb3-02df-4ef8-9142-adef671988ca',
    }),
    ...config,
  });
}

export { getSampleVideo, getSigners } from './utils';
