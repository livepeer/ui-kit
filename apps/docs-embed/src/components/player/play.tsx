"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { PauseIcon, PlayIcon } from "@livepeer/react/assets";
import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)}>
      <Player.Video style={{ height: "100%", width: "100%" }} />
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
    </Player.Root>
  );
};
