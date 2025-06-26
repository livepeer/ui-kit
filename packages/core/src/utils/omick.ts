/**
 * Create a new object containing only the specified keys
 */
export const pick = <T extends object, K extends keyof T>(
  obj: T,
  ...keys: readonly K[]
): Pick<T, K> => {
  try {
    const objectKeys = Object.keys(obj);

    return keys
      .filter((key) => objectKeys.includes(key as string))
      .reduce(
        (prev, curr) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...prev,
          [curr]: obj[curr],
        }),
        {},
      ) as Pick<T, K>;
    // biome-ignore lint/correctness/noUnusedVariables: ignored using `--suppress`
  } catch (e) {
    throw new Error("Could not pick keys for object.");
  }
};

/**
 * Create a new object excluding the specified keys
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  ...keys: readonly K[]
): Omit<T, K> {
  try {
    const objectKeys = Object.keys(obj);

    return objectKeys
      .filter((objectKey) => !keys.some((key) => String(key) === objectKey))
      .reduce(
        (prev, curr) => ({
          // biome-ignore lint/performance/noAccumulatingSpread: <explanation>
          ...prev,
          [curr]: obj[curr as K],
        }),
        {},
      ) as Omit<T, K>;
    // biome-ignore lint/correctness/noUnusedVariables: ignored using `--suppress`
  } catch (e) {
    throw new Error("Could not omit keys for object.");
  }
}
