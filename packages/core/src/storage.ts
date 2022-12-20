interface BaseStorage {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

export type ClientStorage = {
  getItem: <T>(key: string, defaultState?: T | null) => Promise<T | null>;
  setItem: <T>(key: string, value: T | null) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export const noopStorage: BaseStorage = {
  getItem: (_key) => '',
  setItem: (_key, _value) => {
    //
  },
  removeItem: (_key) => {
    //
  },
};

export function createStorage({
  storage = noopStorage,
  key: prefix = 'livepeer',
}: {
  storage?: BaseStorage;
  key?: string;
}): ClientStorage {
  return {
    getItem: async (key, defaultState = null) => {
      try {
        const value = await storage.getItem(`${prefix}.${key}`);
        return value ? JSON.parse(value) : defaultState;
      } catch (error) {
        console.warn(error);
        return defaultState;
      }
    },
    setItem: async (key, value) => {
      if (value === null) {
        await storage.removeItem(`${prefix}.${key}`);
      } else {
        try {
          await storage.setItem(`${prefix}.${key}`, JSON.stringify(value));
        } catch (err) {
          console.error(err);
        }
      }
    },
    removeItem: async (key) => storage.removeItem(`${prefix}.${key}`),
  };
}
