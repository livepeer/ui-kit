export const getSubtleCrypto = async () => {
  if (typeof globalThis?.crypto !== "undefined" && globalThis?.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }

  globalThis.crypto;

  if (typeof window !== "undefined") {
    if (window?.crypto?.subtle) {
      return window.crypto.subtle;
    }

    throw new Error(
      "Browser is not in a secure context (HTTPS), cannot use SubtleCrypto: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto",
    );
  }

  try {
    const nodeCrypto = await import("node:crypto");
    return nodeCrypto.webcrypto.subtle;
  } catch (error) {
    throw new Error(
      `Failed to import Node.js crypto module: ${
        (error as Error)?.message ?? ""
      }`,
    );
  }
};
