import type { BroadcastStore } from "@livepeer/core-web/broadcast";
import { createContextScope } from "@radix-ui/react-context";

import type { Scope } from "@radix-ui/react-context";

const MEDIA_NAME = "Broadcast";

// biome-ignore lint/complexity/noBannedTypes: allow {}
type BroadcastScopedProps<P = {}> = P & { __scopeBroadcast?: Scope };
const [createBroadcastContext, createBroadcastScope] =
  createContextScope(MEDIA_NAME);

type BroadcastContextValue = {
  store: BroadcastStore;
};

const [BroadcastProvider, useBroadcastContext] =
  createBroadcastContext<BroadcastContextValue>(MEDIA_NAME);

export { BroadcastProvider, createBroadcastScope, useBroadcastContext };
export type { BroadcastContextValue, BroadcastScopedProps };
