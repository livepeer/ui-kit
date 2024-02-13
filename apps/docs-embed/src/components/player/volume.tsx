"use client";

import { MuteIcon, UnmuteIcon } from "@livepeer/react/assets";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { vodSource } from "./source";

export default () => {
  return (
    <Player.Root src={getSrc(vodSource)} autoPlay>
      <Player.Container>
        <Player.Video
          title="Agent 327"
          style={{ height: "100%", width: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            left: 20,
            bottom: 20,
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
              flexGrow: 1,
              height: 20,
              alignItems: "center",
              maxWidth: 120,
              touchAction: "none",
              userSelect: "none",
            }}
          >
            <Player.Track
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                position: "relative",
                flexGrow: 1,
                borderRadius: 9999,
                height: "2px",
              }}
            >
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
          </Player.Volume>
        </div>
      </Player.Container>
    </Player.Root>
  );
};
