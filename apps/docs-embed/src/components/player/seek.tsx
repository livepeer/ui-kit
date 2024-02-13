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

        <Player.Seek
          style={{
            position: "absolute",
            left: 20,
            right: 20,
            bottom: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            userSelect: "none",
            touchAction: "none",
          }}
        >
          <Player.Track
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              position: "relative",
              flexGrow: 1,
              borderRadius: 9999,
              height: 2,
            }}
          >
            <Player.SeekBuffer
              style={{
                position: "absolute",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: 9999,
                height: "100%",
              }}
            />
            <Player.Range
              style={{
                position: "absolute",
                backgroundColor: "white",
                borderRadius: 9999,
                height: "100%",
              }}
            />
          </Player.Track>
          <Player.Thumb
            style={{
              display: "block",
              width: 12,
              height: 12,
              backgroundColor: "white",
              borderRadius: 9999,
            }}
          />
        </Player.Seek>
      </Player.Container>
    </Player.Root>
  );
};
