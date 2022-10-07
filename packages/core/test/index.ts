import { ClientConfig, createClient } from '../src/client';
import { studioProvider } from '../src/providers/studio';

export function setupClient(config?: Partial<ClientConfig>) {
  return createClient({
    provider: studioProvider({
      apiKey: process.env.STUDIO_API_KEY,
    }),
    ...config,
  });
}

export {
  MockedVideoElement,
  MockedWebSocket,
  resetDateNow,
  waitForWebsocketOpen,
} from './mocks';
export { getSampleVideo, getSigners } from './utils';
