export const b64Encode = (input: string): string | null => {
  try {
    if (typeof window !== "undefined" && "btoa" in window) {
      return window?.btoa?.(input) ?? null;
    }
    return Buffer?.from(input, "binary")?.toString("base64") ?? null;
  } catch (e) {
    return null;
  }
};

export const b64Decode = (input: string): string | null => {
  try {
    if (typeof window !== "undefined" && "atob" in window) {
      return window?.atob?.(input) ?? null;
    }
    return Buffer?.from(input, "base64")?.toString("binary") ?? null;
  } catch (e) {
    return null;
  }
};

export const b64UrlEncode = (input: string): string | null => {
  return escapeInput(b64Encode(input));
};

export const b64UrlDecode = (input: string): string | null => {
  const unescaped = unescapeInput(input);
  if (unescaped) {
    return b64Decode(unescaped);
  }
  return null;
};

const unescapeInput = (input: string | undefined | null) => {
  return input
    ? (input + "===".slice((input.length + 3) % 4))
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    : null;
};

const escapeInput = (input: string | undefined | null) => {
  return (
    input?.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") ?? null
  );
};

export const getFormattedHoursMinutesSeconds = (
  valueInSeconds: number | undefined | null,
) => {
  if (
    valueInSeconds !== undefined &&
    valueInSeconds !== null &&
    !Number.isNaN(valueInSeconds) &&
    Number.isFinite(valueInSeconds)
  ) {
    const roundedValue = Math.round(valueInSeconds);

    const hours = Math.floor(roundedValue / 3600);
    const seconds = Math.floor(roundedValue % 60);

    if (hours > 0) {
      const minutes = Math.floor((roundedValue % 3600) / 60);

      return `${hours}:${minutes.toString().padStart(2, "0")}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }

    const minutes = Math.floor(roundedValue / 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return "0:00";
};
