export const b64UrlEncode = (input: string): string | null => {
  if (typeof window !== 'undefined' && 'btoa' in window) {
    return escape(window?.btoa?.(input) ?? null);
  } else {
    return escape(Buffer?.from(input, 'binary')?.toString('base64') ?? null);
  }
};

export const b64UrlDecode = (input: string): string | null => {
  const unescaped = unescape(input);
  if (unescaped) {
    if (typeof window !== 'undefined' && 'atob' in window) {
      return window?.atob?.(unescaped) ?? null;
    } else {
      return Buffer?.from(unescaped, 'base64')?.toString('binary') ?? null;
    }
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
