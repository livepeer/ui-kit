// from https://github.com/voodoocreation/ts-deepmerge/blob/master/src/index.ts
interface IObject {
  // biome-ignore lint/suspicious/noExplicitAny: any
  [key: string]: any;
}

type TUnionToIntersection<U> =
  // biome-ignore lint/suspicious/noExplicitAny: any
  (U extends any ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

// biome-ignore lint/suspicious/noExplicitAny: any
const isObject = (obj: any) => {
  if (typeof obj === "object" && obj !== null) {
    if (typeof Object.getPrototypeOf === "function") {
      const prototype = Object.getPrototypeOf(obj);
      return prototype === Object.prototype || prototype === null;
    }

    return Object.prototype.toString.call(obj) === "[object Object]";
  }

  return false;
};

const merge = <T extends IObject[]>(
  ...objects: T
): TUnionToIntersection<T[number]> =>
  objects.reduce((result, current) => {
    if (Array.isArray(current)) {
      throw new TypeError(
        "Arguments provided to ts-deepmerge must be objects, not arrays.",
      );
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(current).forEach((key) => {
      if (["__proto__", "constructor", "prototype"].includes(key)) {
        return;
      }

      if (Array.isArray(result[key]) && Array.isArray(current[key])) {
        result[key] = merge.options.mergeArrays
          ? Array.from(new Set((result[key] as unknown[]).concat(current[key])))
          : current[key];
      } else if (isObject(result[key]) && isObject(current[key])) {
        result[key] = merge(result[key] as IObject, current[key] as IObject);
      } else {
        result[key] = current[key];
      }
    });

    return result;
    // biome-ignore lint/suspicious/noExplicitAny: any
  }, {}) as any;

export interface DeepMergeOptions {
  mergeArrays: boolean;
}

const defaultOptions: DeepMergeOptions = {
  mergeArrays: true,
};

merge.options = defaultOptions;

merge.withOptions = <T extends IObject[]>(
  options: Partial<DeepMergeOptions>,
  ...objects: T
) => {
  merge.options = {
    mergeArrays: true,
    ...options,
  };

  const result = merge(...objects);

  merge.options = defaultOptions;

  return result;
};

export const deepMerge = merge;
