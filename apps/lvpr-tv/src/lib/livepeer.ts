import { Livepeer } from "livepeer";

export const livepeer = new Livepeer({
  apiKey: process.env.STUDIO_API_KEY ?? "",
  serverURL: process.env.NEXT_PUBLIC_STUDIO_BASE_URL,
});
