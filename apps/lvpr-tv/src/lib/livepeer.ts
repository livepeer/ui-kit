import { Livepeer } from "livepeer";

if (
  !process.env.NEXT_PUBLIC_STUDIO_API_KEY ||
  !process.env.NEXT_PUBLIC_STUDIO_BASE_URL
) {
  throw new Error("Missing studio API key or base URL");
}

export const livepeer = new Livepeer({
  apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY,
  serverURL: process.env.NEXT_PUBLIC_STUDIO_BASE_URL,
});
