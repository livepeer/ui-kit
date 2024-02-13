"use client";

import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";

import { useEffect, useRef, useState } from "react";
import { vodSource } from "./source";

export default () => {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (parentRef.current) {
      setIsMounted(true);
    }
  }, []);

  return (
    <>
      <div
        style={{
          height: 20,
          width: "100%",
        }}
        ref={parentRef}
      />
      <Player.Root src={getSrc(vodSource)} autoPlay volume={0}>
        <Player.Container
          style={{
            margin: 5,
            borderRadius: 5,
            outline: "white solid 1px",
            overflow: "hidden",
          }}
        >
          <Player.Video
            title="Agent 327"
            style={{ height: "100%", width: "100%" }}
          />
          {/* This is portalled outside of the parent container,
          which is outlined in white */}
          {isMounted && (
            <Player.Portal container={parentRef.current}>
              <Player.Time />
            </Player.Portal>
          )}
        </Player.Container>
      </Player.Root>
    </>
  );
};
