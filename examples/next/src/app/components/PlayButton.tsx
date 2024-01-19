"use client";

import * as Assets from "@livepeer/react/assets";
import * as Player from "@livepeer/react/player";

import { useState } from "react";

export default function PlayButton() {
  const [playing, setPlaying] = useState(false);

  return (
    <Player.PlayTrigger
      className="w-6 h-6 md:w-7 md:h-7"
      playing={playing}
      onPlayingChange={setPlaying}
    >
      {!playing ? (
        <Assets.PlayIcon className="w-full h-full" />
      ) : (
        <Assets.PauseIcon className="w-full h-full" />
      )}
    </Player.PlayTrigger>
  );
}
