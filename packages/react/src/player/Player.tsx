import { InitialProps } from "@livepeer/core-react";
import {
  Src,
  createControllerStore,
  createStorage,
  version,
} from "@livepeer/core-web";
import { getDeviceInfo } from "@livepeer/core-web/media/browser";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import type * as Radix from "@radix-ui/react-primitive";

import React, { useRef } from "react";

import { PlayerProvider, PlayerScopedProps } from "../context/PlayerContext";
import { Primitive } from "./primitive";

type PlayerElement = React.ElementRef<typeof Primitive.div>;

interface PlayerProps
  extends Radix.ComponentPropsWithoutRef<typeof Primitive.div>,
    Omit<Partial<InitialProps>, "creatorId"> {
  src: Src[] | string;

  /**
   * The aspect ratio of the media. Defaults to 16 / 9.
   * This significantly improves cumulative layout shift.
   *
   * @see {@link https://web.dev/cls/}
   */
  aspectRatio?: number;
}

const Player = React.forwardRef<PlayerElement, PlayerProps>(
  (props: PlayerScopedProps<PlayerProps>, forwardedRef) => {
    const {
      aspectRatio = 16 / 9,
      src,
      autoPlay,
      preload,
      viewerId,
      volume,
      playbackRate,
      ...playerProps
    } = props;

    const store = useRef(
      createControllerStore({
        device: getDeviceInfo(version.react),
        storage: createStorage(
          typeof window !== "undefined"
            ? {
                storage: window.localStorage,
              }
            : {},
        ),
        src,
        initialProps: {
          autoPlay,
          preload,
          viewerId,
          volume,
          playbackRate,
        },
      }),
    );

    // const useBoundStore = useStore(store.current, (state) => state);

    return (
      <PlayerProvider store={store.current} scope={props.__scopePlayer}>
        <AspectRatio.Root
          ratio={aspectRatio}
          {...playerProps}
          ref={forwardedRef}
        />
      </PlayerProvider>
    );
  },
);

const Root = Player;

export { Root };
export type { PlayerProps };
