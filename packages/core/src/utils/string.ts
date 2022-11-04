export const b64Encode = (input: string): string | null => {
  try {
    if (typeof window !== 'undefined' && 'btoa' in window) {
      return window?.btoa?.(input) ?? null;
    } else {
      return Buffer?.from(input, 'binary')?.toString('base64') ?? null;
    }
  } catch (e) {
    return null;
  }
};

export const b64Decode = (input: string): string | null => {
  try {
    if (typeof window !== 'undefined' && 'atob' in window) {
      return window?.atob?.(input) ?? null;
    } else {
      return Buffer?.from(input, 'base64')?.toString('binary') ?? null;
    }
  } catch (e) {
    return null;
  }
};

export const b64UrlEncode = (input: string): string | null => {
  return escape(b64Encode(input));
};

export const b64UrlDecode = (input: string): string | null => {
  const unescaped = unescape(input);
  if (unescaped) {
    return b64Decode(unescaped);
  }
  return null;
};

const unescape = (input: string | undefined | null) => {
  return input
    ? (input + '==='.slice((input.length + 3) % 4))
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    : null;
};

const escape = (input: string | undefined | null) => {
  return (
    input?.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '') ?? null
  );
};
