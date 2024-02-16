"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";
import {
  MediaScopedProps,
  useMediaContext,
  useStore,
} from "@livepeer/react/player";
import { CSSProperties } from "react";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Container className="h-full w-full overflow-hidden bg-gray-950">
        <Player.Video title="Live stream" className="h-full w-full" />

        <CurrentSource
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
          }}
        />
      </Player.Container>
    </Player.Root>
  );
};

function CurrentSource({
  style,
  __scopeMedia,
}: MediaScopedProps<{ style?: CSSProperties }>) {
  const context = useMediaContext("CurrentSource", __scopeMedia);

  const { currentSource } = useStore(context.store, ({ currentSource }) => ({
    currentSource,
  }));

  return currentSource ? (
    <div style={style}>
      <span>
        Playback type:{" "}
        <span
          style={{
            color: "#ffffffe2",
          }}
        >
          {currentSource?.type}
        </span>
      </span>
    </div>
  ) : null;
}
