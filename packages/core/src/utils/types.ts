export const noop = (..._args: any[]) => {
  //
};

export const notEqual = (valueA: unknown, valueB: unknown): boolean => {
  // This ensures (valueB==NaN, valueA==NaN) always returns false.
  return valueB !== valueA && (valueB === valueB || valueA === valueA);
};

export const equal = (valueA: unknown, valueB: unknown): boolean => {
  return !notEqual(valueA, valueB);
};

export const isNull = (value: unknown): value is null => {
  return value === null;
};

export const isUndefined = (value: unknown): value is undefined => {
  return typeof value === 'undefined';
};

export const isNil = (value: unknown): value is null | undefined => {
  return isNull(value) || isUndefined(value);
};

export const isObject = (value: any): value is object => {
  return value?.constructor === Object;
};

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !Number.isNaN(value);
};

export const isString = (value: any): value is string => {
  return typeof value === 'string';
};

export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean';
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
};

export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

export const isWindow = (value: unknown): value is Window => {
  return value === window;
};

export const isReactNative = (): boolean => {
  return (
    typeof navigator !== 'undefined' &&
    typeof navigator.product === 'string' &&
    navigator.product === 'ReactNative'
  );
};
