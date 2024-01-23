import { MediaControllerStore } from "@livepeer/core";
import { createContextScope } from "@radix-ui/react-context";

import type { Scope } from "@radix-ui/react-context";

const MEDIA_NAME = "Media";

type MediaScopedProps<P> = P & { __scopeMedia?: Scope };
const [createMediaContext, createMediaScope] = createContextScope(MEDIA_NAME);

type MediaContextValue = {
  store: MediaControllerStore;
};

const [MediaProvider, useMediaContext] =
  createMediaContext<MediaContextValue>(MEDIA_NAME);

export { MediaProvider, createMediaScope, useMediaContext };
export type { MediaContextValue, MediaScopedProps };
