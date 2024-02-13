"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
      <Player.Container>
        <Player.Video
          title="Agent 327"
          style={{ height: "100%", width: "100%" }}
        />
        <Player.Time
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            height: 25,
            fontVariant: "tabular-nums",
          }}
        />
      </Player.Container>
    </Player.Root>
  );
};
