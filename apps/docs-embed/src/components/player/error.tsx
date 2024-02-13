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
          onProgress={(e) => {
            // we fake an error here every time there is progress

            setTimeout(() => {
              e.target.dispatchEvent(new Event("error"));
            }, 3000);
          }}
        />
        <Player.ErrorIndicator
          matcher="all"
          style={{
            position: "absolute",
            inset: 0,
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "black",
          }}
        >
          An error occurred. Trying to resume playback...
        </Player.ErrorIndicator>
      </Player.Container>
    </Player.Root>
  );
};
