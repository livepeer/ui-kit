import { Livepeer } from "livepeer";

export const livepeer = new Livepeer({
  apiKey: process.env.STUDIO_API_KEY ?? "",
});
