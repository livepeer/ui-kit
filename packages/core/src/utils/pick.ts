export const pick = <T, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>,
): Pick<T, K> => {
  try {
    const objectKeys = Object.keys(obj);

    return keys
      .filter((key) => objectKeys.includes(key as string))
      .reduce(
        (prev, curr) => ({
          ...prev,
          [curr]: obj[curr],
        }),
        {},
      ) as Pick<T, K>;
  } catch (e) {
    throw new Error('Could not pick keys for object.');
  }
};
