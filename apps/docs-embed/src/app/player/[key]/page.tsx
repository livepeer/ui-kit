import {
  CodeWithExampleServer,
  ComponentKey,
} from "@/components/code/code-server";
import Clip from "@/components/player/clip";
import Controls from "@/components/player/controls";
import Live from "@/components/player/live";
import Play from "@/components/player/play";
import Poster from "@/components/player/poster";
import Rate from "@/components/player/rate";
import Seek from "@/components/player/seek";
import Volume from "@/components/player/volume";
import { notFound } from "next/navigation";

export default ({ params }: { params: { key: ComponentKey | undefined } }) => {
  if (!params.key) {
    notFound();
  }

  return (
    <CodeWithExampleServer
      example={
        params.key === "clip" ? (
          <Clip />
        ) : params.key === "controls" ? (
          <Controls />
        ) : params.key === "live" ? (
          <Live />
        ) : params.key === "play" ? (
          <Play />
        ) : params.key === "poster" ? (
          <Poster />
        ) : params.key === "seek" ? (
          <Seek />
        ) : params.key === "rate" ? (
          <Rate />
        ) : params.key === "volume" ? (
          <Volume />
        ) : (
          <></>
        )
      }
      component={params.key}
    />
  );
};
