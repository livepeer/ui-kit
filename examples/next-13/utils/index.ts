import { studioProvider } from "@livepeer/react";

export const getProvider = (isStaging: boolean) =>
  studioProvider(
    !isStaging
      ? {
          apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? "",
        }
      : {
          baseUrl: "https://livepeer.monster/api",
          apiKey: process.env.NEXT_PUBLIC_STUDIO_API_KEY ?? "",
        },
  );
