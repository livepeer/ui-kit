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

        <Player.Controls
          style={{
            padding: 20,
          }}
          autoHide={5000}
        >
          Auto-hidden controls container (with click to pause/play)
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
};
