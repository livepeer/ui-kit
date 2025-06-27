import type { MediaControllerStore } from "@livepeer/core/media";
import type { Scope } from "@radix-ui/react-context";
import { createContextScope } from "@radix-ui/react-context";
import { useStore as useStoreZustand } from "zustand";

const MEDIA_NAME = "Media";

// biome-ignore lint/complexity/noBannedTypes: allow {}
type MediaScopedProps<P = {}> = P & { __scopeMedia?: Scope };
const [createMediaContext, createMediaScope] = createContextScope(MEDIA_NAME);

type MediaContextValue = {
  store: MediaControllerStore;
};

const [MediaProvider, useMediaContext] =
  createMediaContext<MediaContextValue>(MEDIA_NAME);

const useStore = useStoreZustand;

export { MediaProvider, createMediaScope, useMediaContext, useStore };
export type { MediaContextValue, MediaScopedProps };
