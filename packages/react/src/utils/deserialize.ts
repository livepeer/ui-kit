import { PersistedClient } from '@tanstack/react-query-persist-client';

export function deserialize(cachedString: string) {
  const cache = JSON.parse(cachedString);

  return cache as PersistedClient;
}
