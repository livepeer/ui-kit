"use client";

import * as Player from "@livepeer/react/player";
import * as Assets from "@livepeer/react/assets";

import { useState } from "react";

export default function FullscreenButton() {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <Player.FullscreenTrigger
      className="w-6 h-6 md:w-7 md:h-7"
      fullscreen={fullscreen}
      onFullscreenChange={setFullscreen}
    >
      {fullscreen ? (
        <Assets.ExitFullscreenIcon className="w-full h-full" />
      ) : (
        <Assets.EnterFullscreenIcon className="w-full h-full" />
      )}
    </Player.FullscreenTrigger>
  );
}
