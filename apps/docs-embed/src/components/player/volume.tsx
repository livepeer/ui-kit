"use client";

import { MuteIcon, UnmuteIcon } from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay>
      <Player.Video style={{ height: "100%", width: "100%" }} />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          display: "flex",
          alignItems: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <Player.MuteTrigger
          style={{
            width: 25,
            height: 25,
          }}
        >
          <Player.VolumeIndicator asChild matcher={false}>
            <MuteIcon />
          </Player.VolumeIndicator>
          <Player.VolumeIndicator asChild matcher={true}>
            <UnmuteIcon />
          </Player.VolumeIndicator>
        </Player.MuteTrigger>
        <Player.Volume
          style={{
            position: "relative",
            display: "flex",
            flex: "1 1 0%",
            height: 20,
            alignItems: "center",
            maxWidth: 120,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          <Player.Track
            style={{
              position: "relative",
              borderRadius: 1000,
              height: 3,
              flexGrow: 1,
              backgroundColor: "#ffffff40",
            }}
          >
            <Player.Range
              style={{
                position: "absolute",
                backgroundColor: "white",
                borderRadius: 1000,
                height: "100%",
              }}
            />
          </Player.Track>
          <Player.Thumb
            style={{
              display: "block",
              backgroundColor: "white",
              borderRadius: 1000,
              height: 10,
              width: 10,
            }}
          />
        </Player.Volume>
      </div>
    </Player.Root>
  );
};
