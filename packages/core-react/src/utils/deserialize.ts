import { PersistedClient } from '@tanstack/react-query-persist-client';

export function deserialize(cachedString: string) {
  try {
    const cache = JSON.parse(cachedString);

    return cache as PersistedClient;
  } catch (e) {
    return {} as PersistedClient;
  }
}
