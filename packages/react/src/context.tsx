import { MediaControllerStore } from "@livepeer/core-react";
import { createContextScope } from "@radix-ui/react-context";

import type { Scope } from "@radix-ui/react-context";

const PLAYER_NAME = "Player";

type PlayerScopedProps<P> = P & { __scopePlayer?: Scope };
const [createPlayerContext, createPlayerScope] =
  createContextScope(PLAYER_NAME);

type PlayerContextValue = {
  store: MediaControllerStore;
};

const [PlayerProvider, usePlayerContext] =
  createPlayerContext<PlayerContextValue>(PLAYER_NAME);

export { PlayerProvider, createPlayerScope, usePlayerContext };
export type { PlayerContextValue, PlayerScopedProps };
