"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <Player.LiveIndicator
        matcher={false}
        style={{
          position: "absolute",
          left: 20,
          top: 20,
        }}
      >
        STATIC ASSET
      </Player.LiveIndicator>
    </Player.Root>
  );
};
