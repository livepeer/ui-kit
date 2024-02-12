"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay>
      <Player.Video style={{ height: "100%", width: "100%" }} />

      <Player.Seek
        style={{
          position: "absolute",
          left: 20,
          bottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
          userSelect: "none",
          touchAction: "none",
        }}
      >
        <Player.Track className="bg-white/30 relative grow rounded-full transition-all h-[2px] md:h-[3px] group-hover:h-[3px] group-hover:md:h-[4px]">
          <Player.SeekBuffer className="absolute bg-black/30 transition-all duration-1000 rounded-full h-full" />
          <Player.Range className="absolute bg-white rounded-full h-full" />
        </Player.Track>
        <Player.Thumb className="block group-hover:scale-110 w-3 h-3 bg-white transition-all rounded-full" />
      </Player.Seek>
    </Player.Root>
  );
};
