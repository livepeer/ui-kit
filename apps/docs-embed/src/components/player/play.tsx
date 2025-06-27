"use client";

import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
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
        <Player.PlayPauseTrigger
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
            width: 25,
            height: 25,
          }}
        >
          <Player.PlayingIndicator asChild matcher={false}>
            <PlayIcon />
          </Player.PlayingIndicator>
          <Player.PlayingIndicator asChild>
            <PauseIcon />
          </Player.PlayingIndicator>
        </Player.PlayPauseTrigger>
      </Player.Container>
    </Player.Root>
  );
};
