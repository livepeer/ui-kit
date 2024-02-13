"use client";

import * as Broadcast from "@livepeer/react/broadcast";
import { getIngest } from "@livepeer/react/external";

import { useEffect, useRef, useState } from "react";
import { streamKey } from "./stream-key";

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
      <Broadcast.Root ingestUrl={getIngest(streamKey)}>
        <Broadcast.Container
          style={{
            margin: 5,
            borderRadius: 5,
            outline: "white solid 1px",
            overflow: "hidden",
          }}
        >
          <Broadcast.Video
            title="Livestream"
            style={{ height: "100%", width: "100%" }}
          />

          {/* This is portalled outside of the parent container,
           which is outlined in white */}
          {isMounted && (
            <Broadcast.Portal container={parentRef.current}>
              <Broadcast.Time />
            </Broadcast.Portal>
          )}
        </Broadcast.Container>
      </Broadcast.Root>
    </>
  );
};
